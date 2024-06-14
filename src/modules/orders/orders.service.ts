import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { Order } from 'src/entities/order.entity';
import { CreateOrderDTO } from './dto/orders.dto';
import { UUID } from 'crypto';
import { UpdateOrderDTO } from './dto/updateOrder.dto';

@Injectable()
export class OrdersService {
    constructor(private ordersRepository: OrdersRepository) {}
    
    async getOrder(id: string) {
        return await this.ordersRepository.getOrder(id);
    }

   async addOrder(order: CreateOrderDTO) {
        return await this.ordersRepository.addOrder(order);
    }
    async updateOrder(id: string, order: UpdateOrderDTO) {
        return await this.ordersRepository.updateOrder(id, order);
    }
}
