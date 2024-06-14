import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { UUID } from "crypto";
export class LoginUserDTO {

    id?: string;
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        example: 'hCvPm@example.com'
    })
    email: string;

    @IsNotEmpty()
    @ApiProperty({
        example: '***********'
    })
    password: string;

    isAdmin?: boolean;
}