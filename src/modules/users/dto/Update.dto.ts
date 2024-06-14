import { IsEmail, IsOptional, IsString, IsEnum, IsStrongPassword, MinLength, MaxLength, IsPhoneNumber, Matches, IsUUID, IsNotEmpty, IsBoolean, isBoolean } from 'class-validator';
import { eCountry } from 'src/utils/countrys/country.model';
import { Match } from 'src/decorators/match.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDTO {

    
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id: string;

    @IsOptional()
    @IsString({
        message: 'Must be a string'
    })
    @MinLength(3, {
        message: 'The name must be at least 3 characters long'
    })
    @MaxLength(80, {
        message: 'The name cannot exceed 80 characters'
    })
    @ApiPropertyOptional({
        example: 'John Doe'
    })
    nombre?: string;

    @IsOptional()
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
    @ApiPropertyOptional({
        example: '12345678'
    })
    dni?: string;

    @IsOptional()
    @IsEnum(eCountry)
    @ApiPropertyOptional({
        enum: eCountry
    })
    country?: eCountry;

    @IsOptional()
    @IsString()
    @MinLength(5, {
        message: 'The city must be at least 5 characters long'
    })
    @MaxLength(20, {
        message: 'The city cannot exceed 20 characters'
    })
    @ApiPropertyOptional({
        example: 'Buenos Aires'
    })
    city?: string;

    @IsOptional()
    @IsString()
    @MinLength(3, {
        message: 'The address must be at least 3 characters long'
    })
    @MaxLength(80, {
        message: 'The address cannot exceed 80 characters'
    })
    @ApiPropertyOptional({
        example: 'Calle Falsa 123'
    })
    address?: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    @ApiPropertyOptional({
        example: 'aYqFP@example.com'
    })
    email?: string;

    @IsOptional()
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
    @ApiPropertyOptional({
        example: 'Password123*'
    })
    password?: string;

    @IsOptional()
    @IsString()
    @Match('password', { message: 'Passwords do not match' })
    @ApiPropertyOptional({
        example: 'Password123*'
    })
    confirmPassword?: string;

    @IsOptional()
    @IsPhoneNumber(null, {
        message: 'The phone number must be a valid number'
    })
    @ApiPropertyOptional({
        example: '+54 11 1234-5678'
    })
    phone?: string;
    @IsOptional()
    @IsBoolean()
    @ApiProperty({
        required: false,
        example: true,
        description: 'If the user is admin'
    })
    isAdmin?: boolean;
}
