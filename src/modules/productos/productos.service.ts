import { Injectable } from "@nestjs/common";
import { ProductRepository } from "./productos.repository";
import { ProductDTO } from "./dto/product.dto";
import { UpdateProductDTO } from "./dto/update.dto";
import { UUID } from "crypto";


@Injectable()
export class ProductService{
    constructor(private productRepository: ProductRepository){}
    getProducts(page: number, limit: number) {
        return this.productRepository.getProducts(page, limit);
    }

   async getProductById(id: UUID) {
            return await this.productRepository.getOneProduct(id);
    }

    async addProduct(product: ProductDTO) {
        return await this.productRepository.addProduct(product);
    }

    async uploadImage(productId: UUID, file: Express.Multer.File) {
        return await this.productRepository.uploadImage(productId, file);
    }

    delProducts(id: UUID) {
        return this.productRepository.deleteProduct(id);
    }

    updateProduct(product: UpdateProductDTO) {
        return this.productRepository.updateProduct(product);
    }
}