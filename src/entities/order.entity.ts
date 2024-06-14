import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, Column, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { OrderDetails } from './order-details.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  date: Date;

  @OneToOne(() => OrderDetails, orderDetails => orderDetails.order, { cascade: true})
  @JoinColumn()
  orderDetails: OrderDetails;
}