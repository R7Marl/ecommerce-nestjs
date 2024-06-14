import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { OrderDetails } from './order-details.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: false })
  name: string;

  @Column('text', { nullable: false })
  description: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  price: number;

  @Column('int', { nullable: false })
  stock: number;

  @Column({ nullable: true, default: 'default-image-url' })
  imgUrl: string;

  @ManyToOne(() => Category, category => category.products, { onDelete: 'CASCADE'})
  @JoinColumn()
  category: Category;

  @ManyToMany(() => OrderDetails, orderDetails => orderDetails.products, { cascade: true })
  orderDetails: OrderDetails[];
}
