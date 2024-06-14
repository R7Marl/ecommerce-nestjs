import { IsArray, IsNotEmpty, IsOptional, IsUUID, ValidateNested } from "class-validator";
import { UUID } from "crypto";
import { Type } from "class-transformer";
import { ProductDTO } from "./orders.dto";
export class UpdateOrderDTO{
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductDTO)
    products: ProductDTO[];
}