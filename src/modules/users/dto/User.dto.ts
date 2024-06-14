import { IsEmail, IsNotEmpty, IsString, IsEnum, IsStrongPassword, MinLength, MaxLength, IsPhoneNumber, Matches, IsOptional, IsBoolean } from 'class-validator';
import { eCountry } from 'src/utils/countrys/country.model';
import { Match } from 'src/decorators/match.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
    
    @IsNotEmpty()
    @IsString({
        message: 'Must be a string'
    })
    @MinLength(3, {
        message: 'The name must be at least 3 characters long'
    })
    @MaxLength(80, {
        message: 'The name cannot exceed 80 characters'
    })
    @ApiProperty({
        example: 'John Doe'
    })
    nombre: string;

    
    @IsNotEmpty()
    @IsString()
    @MinLength(7, {
        message: 'The DNI must be at least 7 characters long'
    })
    @MaxLength(20, {
        message: 'The DNI cannot exceed 20 characters'
    })
    @Matches(/^[a-zA-Z0-9]+$/, {
        message: 'The DNI can only contain alphanumeric characters'
    })
    @ApiProperty({
        example: '12345678'
    })
    dni: string;

    @IsNotEmpty()
    @IsEnum(eCountry)
    @ApiProperty({
        enum: eCountry
    })
    country: eCountry;

    @IsNotEmpty()
    @IsString()
    @MinLength(5, {
        message: 'The city must be at least 5 characters long'
    })
    @MaxLength(20, {
        message: 'The city cannot exceed 20 characters'
    })
    @ApiProperty({
        example: 'Buenos Aires'
    })
    city: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3, {
        message: 'The address must be at least 3 characters long'
    })
    @MaxLength(80, {
        message: 'The address cannot exceed 80 characters'
    })
    @ApiProperty({
        example: 'Calle Falsa 123'
    })
    address: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @ApiProperty({
        example: 'aYqFP@example.com'
    })
    email: string;

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    }, {
        message: 'The password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*). It must be at least 8 characters long and no more than 15 characters.'
    })
    @MaxLength(15)
    @ApiProperty({
        example: 'Password123*'
    })
    password: string;

    @IsNotEmpty()
    @IsString()
    @Match('password', { message: 'Passwords do not match' })
    @ApiProperty({
        example: 'Password123*'
    })
    confirmPassword: string;

    @IsNotEmpty()
    @IsPhoneNumber(null, {
        message: 'The phone number must be a valid number'
    })
    @ApiProperty({
        example: '+54 11 1234-5678'
    })
    phone: string;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({
        required: false,
        example: true,
        description: 'If the user is admin'
    })
    isAdmin?: boolean;
}
