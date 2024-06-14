import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class OrderDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  price: number;

  @OneToOne(() => Order, order => order.orderDetails)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToMany(() => Product)
  @JoinTable()
  @Exclude({ toPlainOnly: true })
  products: Product[];
}
