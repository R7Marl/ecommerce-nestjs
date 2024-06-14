import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "src/entities/order.entity";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { ProductService } from "../productos/productos.service";
import { OrderDetails } from "src/entities/order-details.entity";
import { CreateOrderDTO } from "./dto/orders.dto";
import { UpdateProductDTO } from "../productos/dto/update.dto";
import { EntityManager } from "typeorm";
import { UpdateOrderDTO } from "./dto/updateOrder.dto";
import { plainToInstance } from "class-transformer";

@Injectable()
export class OrdersRepository {
    constructor(
        @InjectRepository(Order) private orderRepository: Repository<Order>, 
        @InjectRepository(OrderDetails) private orderDetailsRepository: Repository<OrderDetails>, 
        private usersService: UsersService, 
        private productService: ProductService, 
        private entityManager: EntityManager
    ) { }

    // Método para obtener una orden por su ID
    async getOrder(id: string) {
        let result = await this.orderRepository.findOne({ 
            where: {id}, 
            relations: ["user", "orderDetails", "orderDetails.products"] 
        });
        if (!result) {
            throw new NotFoundException("Order does not exist");
        }
        return result;
    }
    // Método para agregar una nueva orden
    async addOrder(order: CreateOrderDTO) {
        try {
            return this.entityManager.transaction(async (transactionEntityManager) => {
                const getUserId = await this.usersService.getUserById(order.userId); // Obtenemos el usuario por su ID
                if (!getUserId) throw new NotFoundException(`User with ID ${order.userId} not found`);
                let products = [];
                let totalPrice = 0;
                for (let i = 0; i < order.products.length; i++) { // Iteramos products
                    const getProduct = await this.productService.getProductById(order.products[i].id);
                    if (!getProduct) throw new NotFoundException(`Product with ID ${order.products[i].id} not found`);
                    if (getProduct.stock <= 0) throw new NotFoundException(`Product with ID ${order.products[i].id} is out of stock`);
                    getProduct.stock--;
                    const updateProductDTO: UpdateProductDTO = {
                        id: getProduct.id,
                        name: getProduct.name,
                        description: getProduct.description,
                        price: getProduct.price,
                        stock: getProduct.stock,
                        category: getProduct.category?.name
                    };
                    this.productService.updateProduct(updateProductDTO);
                    products.push(getProduct);
                    totalPrice += Number(getProduct.price);

                }

                const newOrder = transactionEntityManager.create(Order, {
                    user: getUserId,
                    date: new Date()
                });

                const savedOrder = await transactionEntityManager.save(Order, newOrder);

                const orderDetails = {
                    order: savedOrder,
                    products: products,
                    price: totalPrice
                };
                const savedOrderDetails = await transactionEntityManager.save(OrderDetails, orderDetails);
                savedOrder.orderDetails = savedOrderDetails;
                await transactionEntityManager.save(Order, savedOrder);
                return {
                    ...savedOrder,
                    orderDetails: {
                        id: savedOrderDetails.id,
                        products: savedOrderDetails.products,
                        price: savedOrderDetails.price
                    }
                };
            })
        } catch (error) {
            if(error instanceof NotFoundException) {
                throw error;
            }
            console.log(error)
            throw new InternalServerErrorException(error);
        }
    }

    // Método para actualizar una orden existente
    async updateOrder(id: string, order: UpdateOrderDTO): Promise<any> {
        try {
            return await this.entityManager.transaction(async (transactionEntityManager) => {
                const existingOrder = await this.orderRepository.findOne({ 
                    where: {id}, 
                    relations: ["user", "orderDetails", "orderDetails.products"] 
                });
                if(!existingOrder) throw new Error("Order not found");
                let products = [...existingOrder.orderDetails.products];
                let totalPrice = 0;
                for(const product of order.products) {
                    const getProducts = await this.productService.getProductById(product.id);
                    if(!getProducts) throw new Error("Product not found");
                    if(getProducts.stock <= 0) throw new Error(`Product with ID ${product.id} is out of stock`);
                    getProducts.stock--; // Reducimos el stock del producto
                    const updateProductDTO: UpdateProductDTO = {
                        id: getProducts.id,
                        name: getProducts.name,
                        description: getProducts.description,
                        price: getProducts.price,
                        stock: getProducts.stock,
                        category: getProducts.category?.name
                    };
                    products.push(getProducts); // Añadimos el producto a la lista
                    totalPrice += Number(getProducts.price); // Sumamos el precio del producto al total
                    this.productService.updateProduct(updateProductDTO); // Actualizamos el producto
                }
                console.log(totalPrice)
                const newDate = new Date();
                await transactionEntityManager.save(Order, {...existingOrder, date: newDate}); // Guardamos la orden con la nueva fecha
                existingOrder.orderDetails.products = products;
                existingOrder.orderDetails.price = totalPrice;
                return await transactionEntityManager.save(OrderDetails, existingOrder.orderDetails); // Guardamos los detalles de la orden actualizados
            })
        } catch (error){
            console.log(error);
            throw new NotFoundException(error.message);
        }
    }
}