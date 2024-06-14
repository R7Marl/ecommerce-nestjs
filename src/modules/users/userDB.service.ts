import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { EntityManager, Repository } from "typeorm";
import { Credential } from "src/entities/credential.entity";
import { Order } from "src/entities/order.entity";
import { PasswordSecure } from "./secure/password.service";
import { UUID } from "crypto";
import { CreateUserDTO } from "./dto/User.dto";
import { UpdateUserDTO } from "./dto/Update.dto";
@Injectable()
export class UserDBService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>, @InjectRepository(Credential)private credentialsRepository: Repository<Credential>, @InjectRepository(Order) private orderRepository: Repository<Order>, private passwordSecure: PasswordSecure, private readonly entityManager: EntityManager,
){}

    async getUsers(page: number, limit: number) {
        const users = await this.usersRepository.find({
            take: limit,
            skip: (page - 1) * limit
        });
        return users;
    }
    async saveUser(user: CreateUserDTO) {
        try {
            return this.entityManager.transaction(async (transactionalEntityManager) => {
                console.log(user);
                const { nombre, dni, phone, country, city, address, email, password } = user;
                const hashedPassword = this.passwordSecure.hashPassword(password);
    
                const credentials = new Credential();
                credentials.email = email;
                credentials.password = hashedPassword;
                await transactionalEntityManager.save(credentials);
    
                let user1 = await transactionalEntityManager.findOne(User, { where: { credentials: credentials } });
                if (!user1) {
                    if(user.isAdmin) {
                        user1 = transactionalEntityManager.create(User, { nombre, dni, phone, country, city, address, isAdmin: user.isAdmin });
                        user1.credentials = credentials;
                        await transactionalEntityManager.save(user1);
                    } else {
                        user1 = transactionalEntityManager.create(User, { nombre, dni, phone, country, city, address, isAdmin: false });
                        user1.credentials = credentials;
                        await transactionalEntityManager.save(user1);
                    }
                } else {
                    throw new NotFoundException("User not found");
                }
                return user1;
            });
        } catch (error) {
            if(error instanceof NotFoundException) {
                throw error.message;
            }
            throw new InternalServerErrorException(error);
        }
    }
    async getUserById(id: UUID) {
        const user = await this.usersRepository.findOne({where: {id}});
        if(!user) throw new NotFoundException("User not found");
        const orders = await this.orderRepository.find({where: {user: user}});
        const ordersId = orders.map(o => o.id);
        const ordersDate = orders.map(o => o.date);
        return {...user, ordersId, ordersDate};
    } 
    async deleteUserById(id: string) {
        const user = await this.usersRepository.findOne({ where: { id }, relations: ['orders', 'credentials'] });
        if (!user) throw new NotFoundException("User not found");
    
        try {
    
          await this.usersRepository.softDelete(user.id);
    
          // Verificar si el deletedAt se ha actualizado
          const deletedUser = await this.usersRepository.findOne({ where: { id }, withDeleted: true });
          console.log('Deleted User:', deletedUser);
          return deletedUser;
        } catch (error) {
          if (error instanceof NotFoundException) {
            throw error;
          }
          throw new InternalServerErrorException(error);
        }
      }
    async updateUserById(user: UpdateUserDTO) {
        const existingUser = await this.usersRepository.findOne({ where: { id: user.id }, relations: { credentials: true } });
        if (!existingUser) throw new NotFoundException("User not found");
        console.log(existingUser);
        try {
            return this.entityManager.transaction(async (transactionalEntityManager) => {
                if (user.email || user.password) {
                    const credentials = await this.credentialsRepository.findOneBy( { id: existingUser.credentials.id } );
                    if (user.email) {
                        credentials.email = user.email;
                    }
                    if (user.password) {
                        credentials.password = this.passwordSecure.hashPassword(user.password);
                    }
                    await transactionalEntityManager.save(Credential, credentials);
                }
                const userToSave = {
                    nombre: user.nombre,
                    dni: user.dni,
                    phone: user.phone,
                    country: user.country,
                    city: user.city,
                    address: user.address,
                    isAdmin: user.isAdmin
                }
                const updatedUser = {
                    ...existingUser,
                    ...userToSave,
                };
                await transactionalEntityManager.save(User, updatedUser);
                return updatedUser;
            });
        } catch (error) {
            if(error instanceof NotFoundException) {
                throw error;
            } 
            throw new InternalServerErrorException(error);
        }
    }
}