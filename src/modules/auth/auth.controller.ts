import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { CreateUserDTO } from "../users/dto/User.dto";
import { LoginUserDTO } from "./dto/login.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private usersService: UsersService) {}
    @Post("/register")
    registerUser(@Body() user: CreateUserDTO) {
        return this.usersService.addUser(user);
    }
    @Post("/login")
    async postAuth(@Body() user: LoginUserDTO) {
        return[{login: "success", token: await this.authService.signIn(user)}]
    }
}