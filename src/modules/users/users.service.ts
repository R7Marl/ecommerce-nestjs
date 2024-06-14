import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { UUID } from "crypto";
import { CreateUserDTO } from "./dto/User.dto";
import { User } from "src/entities/user.entity";
import { UpdateUserDTO } from "./dto/Update.dto";
@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository){}

    async addUser(user: CreateUserDTO) {
        return await this.usersRepository.addUser(user);
    }
   async deleteUser(id: string) {
       return await this.usersRepository.deleteUser(id);
    }
   async getUsers(page: number, limit: number) {
        return this.usersRepository.getUsers(page, limit);
      }

    async getUserById(id: UUID): Promise<User> {
      return await this.usersRepository.getUserById(id);
    }
    async updateUserById(user: UpdateUserDTO) {
      return await this.usersRepository.updateUserById(user);
    }
}