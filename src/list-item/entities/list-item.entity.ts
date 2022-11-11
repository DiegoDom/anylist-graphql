import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { List } from '../../lists/entities';
import { Item } from '../../items/entities';

@Entity({ name: 'listItems' })
@Unique('listItem-item', ['list', 'item'])
@ObjectType()
export class ListItem {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column('float', {
    default: 0.0,
  })
  @Field(() => Float)
  quantity: number;

  @Column('boolean', {
    default: true,
  })
  @Field(() => Boolean)
  completed: boolean;

  @ManyToOne(() => List, (list) => list.listItem, { lazy: true })
  @Field(() => List)
  list: List;

  @ManyToOne(() => Item, (item) => item.listItem, { lazy: true })
  @Field(() => Item)
  item: Item;
}
