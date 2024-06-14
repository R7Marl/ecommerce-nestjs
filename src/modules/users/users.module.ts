import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDBService } from './userDB.service';
import { User } from 'src/entities/user.entity';
import { Credential } from 'src/entities/credential.entity';
import { Order } from 'src/entities/order.entity';
import { PasswordSecure } from './secure/password.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [TypeOrmModule.forFeature([User, Credential, Order]), JwtModule],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository, UserDBService, PasswordSecure],
    exports: [UsersService, TypeOrmModule]
})
export class UsersModule {
}