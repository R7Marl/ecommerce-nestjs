import { Injectable } from "@nestjs/common";
import { UserDBService } from "./userDB.service";
import { UUID } from "crypto";
import { CreateUserDTO } from "./dto/User.dto";
import { User } from "src/entities/user.entity";
import { UpdateUserDTO } from "./dto/Update.dto";
@Injectable()
export class UsersRepository {
    constructor(private userDBService: UserDBService){}
    private users = [];
    async addUser(user: CreateUserDTO) {
        return await this.userDBService.saveUser(user);
    }
    async deleteUser(id: string) {
        return await this.userDBService.deleteUserById(id);
    }
    getUsers(page: number, limit: number) {
        return this.userDBService.getUsers(page, limit);
    }
   async getUserById(id: UUID): Promise<User> {
       const user = await this.userDBService.getUserById(id)
       return user;
    }
   async updateUserById(user: UpdateUserDTO) {
       return await this.userDBService.updateUserById(user);
    }
}