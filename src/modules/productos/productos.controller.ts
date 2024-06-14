import { Body, Controller, Get, Param, Post, Query, UseGuards, UseInterceptors, Req, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, ParseUUIDPipe, Put } from "@nestjs/common";
import { ProductService } from "./productos.service";
import { ProductDTO } from "./dto/product.dto";
import { QueryInterceptor } from "src/interceptors/query.interceptors";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "src/guards/auth.guard";
import { UUID } from "crypto";
import { UpdateProductDTO } from "./dto/update.dto";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/decorators/roles.decorator";
import { Roles as Role } from "src/utils/roles/role.enum";
import { RolesGuard } from "src/guards/roles.guard";
@ApiTags('Products')
@Controller('products')
export class ProductosController {
    constructor(private readonly productsService: ProductService ){}
    
    @Get()
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @UseInterceptors(QueryInterceptor)
    getProducts(@Req() request: any) {
        return this.productsService.getProducts(request.page, request.limit);
    }
    @ApiBearerAuth()
    @Post('add')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.admin)
    async addProduct(@Body() product: ProductDTO) {
        console.log(product)
        return await this.productsService.addProduct(product);
    }
    @ApiBearerAuth()
    @Post('/upload/:productId')
    @UseGuards(AuthGuard)
    @Roles(Role.admin)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary'
                }
            }
        }
    })
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(@Param('productId', ParseUUIDPipe) productId: UUID, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
            new FileTypeValidator({ fileType: 'image/*' })
        ]
    })) file: Express.Multer.File) {
        return await this.productsService.uploadImage(productId, file);
    }
    @ApiBearerAuth()
    @Put('/update')
    @UseGuards(AuthGuard)
    @Roles(Role.admin)
    updateProduct(product: UpdateProductDTO) {
        return this.productsService.updateProduct(product);
    }
}