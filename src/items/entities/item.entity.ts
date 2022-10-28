import { Field, ID, ObjectType, Float } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column('text')
  @Field(() => String)
  name: string;

  @Column('float', {
    default: 0.0,
  })
  @Field(() => Float)
  quantity: number;

  @Column('text', { nullable: true, default: 'pza' })
  @Field(() => String, { nullable: true })
  quantityUnits?: string;
}
