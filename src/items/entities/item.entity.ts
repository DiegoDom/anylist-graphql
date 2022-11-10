import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column('text')
  @Field(() => String)
  name: string;

  /* @Column('float', {
    default: 0.0,
  })
  @Field(() => Float)
  quantity: number; */

  @Column('text', { nullable: true, default: 'pza' })
  @Field(() => String, { nullable: true })
  quantityUnits?: string;

  @ManyToOne(() => User, (user) => user.items, { nullable: false, lazy: true })
  @Index('userId-index')
  @Field(() => User)
  user: User;
}
