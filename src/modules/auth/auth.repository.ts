import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { LoginUserDTO } from "./dto/login.dto";
import { ApiService } from "../api/api.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Credential } from "src/entities/credential.entity";
import { Repository } from "typeorm";
import { PasswordSecure } from "../users/secure/password.service";
import { User } from "src/entities/user.entity";
@Injectable()
export class AuthRepository {
    constructor(private apiService: ApiService, @InjectRepository(Credential) private crendetials: Repository<Credential>, @InjectRepository(User) private userRepository: Repository<User>,private passwordSecure: PasswordSecure) {}
   async signIn(user: LoginUserDTO) {
        try {
            const searchEmail = await this.crendetials.findOne({ where: { email: user.email } });
            if(!searchEmail) throw new NotFoundException("Email not found");
            const userDB = await this.userRepository.findOne({ where: { credentials: searchEmail } });
            if(!userDB) throw new NotFoundException("User not found");
            if(this.passwordSecure.comparePassword(searchEmail.password, user.password)) {
                user.id = userDB.id;
                if(userDB.isAdmin) user.isAdmin = true;
                else user.isAdmin = false;
                return this.apiService.getApiKey(user);
            }
            throw new BadRequestException("Wrong password");
        } catch (error) {
            if(error instanceof NotFoundException) throw error;
            else if(error instanceof BadRequestException) throw new BadRequestException(error.message);
            throw new InternalServerErrorException(error.message);
        }
    }
}