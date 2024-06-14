import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../entities/category.entity';
import { Product } from '../../entities/product.entity';
import * as fs from 'fs';
import { Repository } from 'typeorm';
import path from 'path';
import { performance } from 'perf_hooks';
@Injectable()
export class PreLoaderService implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}
  async onModuleInit() {
    console.log('[Preloader] Preloader init service');
    const start = performance.now();
    if((await this.categoryRepository.count()) > 0) {
      console.log('[Preloader] Categorys already loaded');
      return;
    }
    if((await this.productRepository.count()) > 0) {
      console.log('[Preloader] Products already loaded');
      return;
    }
    console.log('[Preloader] Loading data');
    await this.loadData();
    const end = performance.now();
    console.log(`[Preloader] Loaded data in ${Math.floor(end - start)} ms`);
  }

  async loadData() {
    const pathData = path.resolve(__dirname + '../../../../src/utils/data.json');
    const data = fs.readFileSync(pathData, 'utf8');
    const dataJson = JSON.parse(data);
    for (const dat of dataJson) {
      await this.categoryRepository
        .createQueryBuilder()
        .insert()
        .into(Category)
        .values({
          name: dat.category,
          description: dat.name,
        })
        .orIgnore()
        .execute();
      const category = await this.categoryRepository
        .createQueryBuilder('category')
        .where('category.name = :name', { name: dat.category })
        .getOne();
      this.productRepository
        .createQueryBuilder()
        .insert()
        .into(Product)
        .values({
          name: dat.name,
          description: dat.description,
          price: dat.price,
          stock: dat.stock,
          category,
        })
        .orIgnore()
        .execute();
    }
  }
}
