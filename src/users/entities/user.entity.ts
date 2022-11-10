import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Item } from '../../items/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column('text', {
    unique: true,
  })
  @Field(() => String)
  email: string;

  @Column('text')
  @Field(() => String)
  fullName: string;

  @Column('text', {
    select: false,
  })
  //! @Field(() => String)
  password: string;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  @Field(() => [String])
  roles: string[];

  @Column('boolean', {
    default: true,
  })
  @Field(() => Boolean)
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.lastUpdatedBy, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: 'lastUpdatedBy' })
  @Field(() => User, { nullable: true })
  lastUpdatedBy?: User;

  @OneToMany(() => Item, (item) => item.user)
  // @Field(() => [Item])
  items: Item[];
}
