import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID, IsNumber, IsUrl, IsDecimal, IsOptional } from "class-validator";
export class UpdateProductDTO {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426655440000'
    })
    id: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Camisa'
    })
    name?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Camisa de algoda'
    })
    description?: string;

    @IsNumber()
    @IsOptional()
    @IsDecimal()
    @ApiProperty({
        example: 100.00
    })
    price?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        example: 10
    })
    stock?: number;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Camisa'
    })
    category?: string;

    @IsString()
    @IsUrl()
    @IsOptional()
    @ApiProperty({
        example: 'https://i.pinimg.com/736x/84/c5/ff/84c5ff4002c4c4bd4f780320cec7db8c.jpg'
    })
    imgUrl?: string;
}