import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
export class CreateCategoryDTO {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: 'Electronics'
    })
    name: string
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: 'Electronics category'
    })
    description: string;
}