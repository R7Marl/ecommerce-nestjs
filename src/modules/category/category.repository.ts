import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/entities/category.entity";
import { EntityManager, Repository } from "typeorm";
import { CreateCategoryDTO } from "./dto/category.dto";
import { UpdateCategoryDTO } from "./dto/updateCategory.dto";
import { UUID } from "crypto";

Injectable()
export class CategoryRepository {
    constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>, private entityManager: EntityManager){}
    getCategory(page: number, limit: number): Promise<Category[]> {
        const index = (page - 1) * limit;
        return this.categoryRepository.find({
            skip: index,
            take: limit
        })
    }
    async addCategory(category: CreateCategoryDTO) {
        try {
            return this.entityManager.transaction(async(transactionEntityManager) => {
                const searchCategory = await this.categoryRepository.findOne({where: {name: category.name}});
                if(searchCategory) throw new BadRequestException("Category already exists");
                const newCategory = new Category();
                newCategory.name = category.name;
                newCategory.description = category.description;
                return await transactionEntityManager.save(newCategory);
            })
        } catch (error) {
            if(error instanceof BadRequestException) throw new BadRequestException(error.message);
            throw new InternalServerErrorException(error.message);
        }
    }

    async updateCategory(category: UpdateCategoryDTO) {
        try {
            return this.entityManager.transaction(async(transactionEntityManager) => {
                const searchCategory = await this.categoryRepository.findOne({where: {id: category.id}});
                if(!searchCategory) {
                    const newCategory = new Category();
                    newCategory.name = category.name;
                    newCategory.description = category.description;
                    return {...await transactionEntityManager.save(newCategory), message: "Category no exist was created"}; // Si no existe, la agrega;
                } 
                searchCategory.name = category.name;
                searchCategory.description = category.description;
                return {...await transactionEntityManager.save(searchCategory), message: "Category was updated"};
            })
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async deleteCategory(id: UUID) {
        try {
            const category = await this.categoryRepository.findOne({where: {id}});
            if(!category) throw new Error("Category not found");
            return await this.categoryRepository.delete(category.id);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}