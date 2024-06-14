import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { Category } from 'src/entities/category.entity';
import { CreateCategoryDTO } from './dto/category.dto';
import { UUID } from 'crypto';
import { UpdateCategoryDTO } from './dto/updateCategory.dto';

@Injectable()
export class CategoryService {
    constructor(private categoryRepository: CategoryRepository) {}
    getCategoryAll(page: number, limit: number): Promise<Category[]> {
        return this.categoryRepository.getCategory(page, limit);
    }
    async addCategory(category: CreateCategoryDTO) {
     return await this.categoryRepository.addCategory(category);
    }

    async updateCategory(category: UpdateCategoryDTO) {
        return await this.categoryRepository.updateCategory(category)
    }

    async deleteCategory(id: UUID) {
        return await this.categoryRepository.deleteCategory(id);
    }
}
