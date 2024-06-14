import { Injectable } from "@nestjs/common";
import { config as dotenvConfig } from 'dotenv';
import { createHash } from "crypto";
@Injectable()
export class PasswordSecure {
    
    hashPassword(password: string) {
        const hash = createHash(process.env.PASSWORD_TYPE);
        hash.update(password);
        const hashedPassword = hash.digest('hex');
        return hashedPassword;
    }
    comparePassword(hashedPassword: string, password: string) {
        const newHashedPassword = this.hashPassword(password);
        return hashedPassword === newHashedPassword ? true : false;
    }
    
}