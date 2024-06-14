import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Product } from 'src/entities/product.entity';
import { PreLoaderService } from './preloader.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product])],
  providers: [PreLoaderService],
})
export class PreloaderModule {}