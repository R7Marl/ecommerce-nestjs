import { Injectable } from '@nestjs/common';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env.development' });
import * as jwt from 'jsonwebtoken';
import { LoginUserDTO } from '../auth/dto/login.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Roles as Role } from '../../utils/roles/role.enum';
@Injectable()
export class ApiService {
    constructor() {}
    getApiKey(user: LoginUserDTO) {
        return this.generateApiKey(user);
    }
    generateApiKey(user: LoginUserDTO) {
        if(user.isAdmin){
            const payload = {
                id: user.id,
                email: user.email,
                isAdmin: user.isAdmin
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
            return token;
        } else {
            const payload = {
                id: user.id,
                email: user.email,
                isAdmin: false
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
            return token;
        }
    }

}