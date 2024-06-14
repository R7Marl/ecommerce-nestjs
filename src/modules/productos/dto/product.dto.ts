import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, IsDecimal, IsUUID } from "class-validator";
export class ProductDTO {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: 'Samsung Phone',
        description: 'Name of the product'
    })
    name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: 'Samsung A12 128GB'
    })
    description: string;

    @IsNotEmpty()
    @ApiProperty({
        example: '100.00'
    })
    price: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        example: '10'
    })
    stock: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: 'smartphone',
    })
    category: string;
    
}