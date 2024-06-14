import { Module } from "@nestjs/common";
import { ProductService } from "./productos.service";
import { ProductosController } from "./productos.controller";
import { ProductRepository } from "./productos.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "src/entities/product.entity";
import { UploadService } from "../upload/upload.service";
import { CloudinaryConfig } from "src/config/cloudinary";
import { Category } from "src/entities/category.entity";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [TypeOrmModule.forFeature([Product, Category]), JwtModule],
    controllers: [ProductosController],
    providers: [ProductService, ProductRepository, UploadService, CloudinaryConfig],
    exports: [ProductService, TypeOrmModule]
})

export class ProductModule{}