import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ProductModule } from './modules/productos/productos.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig from './config/database';
import { PreloaderModule } from './modules/preloader/preloader.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ApiModule } from './modules/api/api.module';
import { AuthGuard } from './guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './guards/roles.guard';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [typeOrmConfig],
  }), TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => config.get('typeorm')
  }),
UsersModule, ProductModule, AuthModule, PreloaderModule, OrdersModule, ApiModule, JwtModule, CategoryModule],
  controllers: [],
  providers: [AuthGuard, RolesGuard],
})

export class AppModule {}