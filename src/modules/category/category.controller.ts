import { Controller, Get, Post, Put, Req, UseGuards, UseInterceptors, Body, Delete } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { QueryInterceptor } from 'src/interceptors/query.interceptors';
import { CategoryService } from './category.service';
import { CreateCategoryDTO } from './dto/category.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Roles as Role } from 'src/utils/roles/role.enum';
import { UUID } from 'crypto';
import { UpdateCategoryDTO } from './dto/updateCategory.dto';
@ApiTags('Category')
@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService){}
    @ApiBearerAuth()
    @Get()
    @UseGuards(AuthGuard)
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @UseInterceptors(QueryInterceptor)
    async getCategoryAll(@Req() request: any) {
        return await this.categoryService.getCategoryAll(request.page, request.limit);
    }

    @ApiBearerAuth()
    @Post('/add')
    @UseGuards(AuthGuard)
    @Roles(Role.admin)
   async addCategory(@Body() category: CreateCategoryDTO) {
        return await this.categoryService.addCategory(category);
    }

    @ApiBearerAuth()
    @Put('/update')
    @UseGuards(AuthGuard)
    @Roles(Role.admin)
    async updateCategory(@Body() category: UpdateCategoryDTO) {
        return await this.categoryService.updateCategory(category);
    }

    @ApiBearerAuth()
    @Delete('/delete')
    @UseGuards(AuthGuard)
    @Roles(Role.admin)
   async deleteCategory(id: UUID) {
        return await this.categoryService.deleteCategory(id);
    }
}
