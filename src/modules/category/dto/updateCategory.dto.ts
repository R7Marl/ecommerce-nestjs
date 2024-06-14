import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { UUID } from "crypto"

export class UpdateCategoryDTO {
    @IsNotEmpty()
    @IsUUID()
    id: string;

    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Electronics'
    })
    name?: string
    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Electronic products'
    })
    description?: string
}