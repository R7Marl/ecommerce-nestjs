import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { QueryInterceptor } from 'src/interceptors/query.interceptors';
import { Order } from 'src/entities/order.entity';
import { CreateOrderDTO } from './dto/orders.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { UpdateUserDTO } from '../users/dto/Update.dto';
import { UpdateOrderDTO } from './dto/updateOrder.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Roles as Role } from 'src/utils/roles/role.enum';
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService) {}
    @ApiBearerAuth()
    @Get()
    @UseGuards(AuthGuard)
    @Roles(Role.admin)
    async getOrder(@Query('id') id: string) {
        console.log(id);
        return await this.ordersService.getOrder(id);
    }
    @ApiBearerAuth()
    @Post('add')
    @UseGuards(AuthGuard)
    @Roles(Role.admin)
    async addOrder(@Body() order: CreateOrderDTO) {
        return await this.ordersService.addOrder(order);
    }
    @ApiBearerAuth()
    @Put('/update/:id')
    @UseGuards(AuthGuard)
    @Roles(Role.admin)
    async updateOrder(@Param('id') id: string, @Body() order: UpdateOrderDTO) {
        return await this.ordersService.updateOrder(id, order);
    }
    
}
