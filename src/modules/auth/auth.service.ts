import { Injectable } from "@nestjs/common";
import { AuthRepository } from "./auth.repository";
import { LoginUserDTO } from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(private authRepository: AuthRepository){}
    async signIn(user: LoginUserDTO) {
        return await this.authRepository.signIn(user);
    }
}