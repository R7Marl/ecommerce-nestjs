import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ProductDTO } from "./dto/product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "src/entities/product.entity";
import { Repository, EntityManager } from "typeorm";
import { UploadService } from "../upload/upload.service";
import { Category } from "src/entities/category.entity";
import { UpdateProductDTO } from "./dto/update.dto";
import { UUID } from "crypto";

@Injectable()

export class ProductRepository { 
  constructor(@InjectRepository(Product) private productRepository: Repository<Product>, private entityManager: EntityManager, @InjectRepository(Category) private categoryRepository: Repository<Category>, private upload: UploadService) {}
   async addProduct(product: ProductDTO) {
            try {
                const { name, description, price, stock, category } = product;
               return this.entityManager.transaction(async (transactionalEntityManager) => {
                const searchCategory = await this.categoryRepository.findOne({where: {name: category}});
                if(!searchCategory) throw new NotFoundException("Category not found");
                const newProduct = new Product();
                newProduct.name = name;
                newProduct.description = description;
                newProduct.price = price;
                newProduct.stock = stock;
                newProduct.category = searchCategory;
                await transactionalEntityManager.save(newProduct);
                return newProduct;
        }) 
            } catch (e){
                throw new InternalServerErrorException(e.message);
            }
    }
    async uploadImage(productId: UUID, file: Express.Multer.File) {
        try {
            return this.entityManager.transaction(async (transactionalEntityManager) => {
            const product = await this.productRepository.findOneBy({id: productId});
            if(!product) throw new Error("Product not found");
            const { secure_url } = await this.upload.uploadImage(file);
            product.imgUrl = secure_url;
            await transactionalEntityManager.save(product);
            return product;
            })
        } catch (e){
            throw new NotFoundException(e.message);
        }

    }
    
    async deleteProduct(id: UUID) {
        try {
          return this.entityManager.transaction(async (transactionalEntityManager) => {
            const product = await this.productRepository.findOneBy({id});
            if (!product) throw new Error("Product not found");
            
            await transactionalEntityManager.softDelete(Product, product);
            return { message: "Product successfully deleted" };
          });
        } catch (e) {
          throw new NotFoundException(e.message);
        }
      }
    getProducts(page: number, limit: number) {
        console.log(page, limit)
        const index = (page - 1) * limit;
       return this.productRepository.find({
           skip: index,
           take: limit
       })
    }
    async getOneProduct(id: UUID) {
            return await this.productRepository.findOne({
              where: { id }
            })
    }
    async updateProduct(product: UpdateProductDTO) {
        try {
            const searchCategory = await this.categoryRepository.findOne({where: {name: product.category}});
            if(!searchCategory) throw new NotFoundException("Category not found");
            const { name, description, price, stock, id } = product;
            const productFound = await this.productRepository.findOneBy({id});
            if(!productFound) throw new NotFoundException("Product not found");
            productFound.name = name;
            productFound.description = description;
            productFound.price = price;
            productFound.stock = stock;
            productFound.category = searchCategory;
            return await this.productRepository.save(productFound);
        } catch (e) {
          if(e instanceof NotFoundException) throw new NotFoundException(e.message);
          throw new NotFoundException(e.message);   
        }
    }
}