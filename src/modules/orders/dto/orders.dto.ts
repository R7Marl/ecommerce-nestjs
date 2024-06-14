import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from "class-validator"
import { UUID } from "crypto";
export class ProductDTO {
    @IsNotEmpty()
    @IsUUID()
    id: UUID;
}

export class CreateOrderDTO {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        type: String,
        description: 'User ID'
    })
    userId: UUID;
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductDTO)
    @ApiProperty({
        type: [ProductDTO],
        description: 'Products'
    })
    products: ProductDTO[];
}