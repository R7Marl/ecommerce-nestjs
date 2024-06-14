import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { Credential } from './credential.entity';
import { Order } from './order.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ unique: true, length: 20 })
  dni: string;

  @Column({ length: 100 })
  phone: string;
  @Column({ length: 100})
  country: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 255 })
  address: string;

  @Column()
  isAdmin: boolean;

  @OneToOne(() => Credential, credentials => credentials.user, { cascade: true })
  @JoinColumn()
  credentials: Credential;
  @OneToMany(() => Order, order => order.user)
  orders: Order[];
  @DeleteDateColumn({
    name: 'deleted_at'
  })
  deletedAt?: Date;
}