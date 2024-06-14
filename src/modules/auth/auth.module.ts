import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { UsersModule } from "../users/users.module";
import { ApiService } from "../api/api.service";
import { PasswordSecure } from "../users/secure/password.service";


@Module({
    imports: [UsersModule],
    controllers: [AuthController],
    providers: [AuthService, AuthRepository, ApiService, PasswordSecure],
})
export class AuthModule {}