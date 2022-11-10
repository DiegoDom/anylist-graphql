import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateItemInput, UpdateItemInput } from './dto';
import { User } from '../users/entities';
import { Item } from './entities/item.entity';
import { PaginationsArgs, SearchArgs } from '../common/dto/args';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepositoty: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.itemsRepositoty.create({ ...createItemInput, user });
    return await this.itemsRepositoty.save(newItem);
  }

  async findAll(
    user: User,
    paginationsArgs: PaginationsArgs,
    searchArgs: SearchArgs,
  ): Promise<Item[]> {
    const { limit, offset } = paginationsArgs;
    const { search } = searchArgs;

    const queryBuilder = this.itemsRepositoty
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, { userId: user.id });

    if (search) {
      queryBuilder.andWhere('LOWER(name) like :name', {
        name: `%${search.toLocaleLowerCase()}%`,
      });
    }

    return await queryBuilder.getMany();

    /* return await this.itemsRepositoty.find({
      take: limit,
      skip: offset,
      where: {
        user: {
          id: user.id,
        },
        name: Like(`%${search}%`),
      },
    }); */
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemsRepositoty.findOneBy({
      id,
      user: { id: user.id },
    });

    if (!item)
      throw new NotFoundException(`There is not items with the ID ${id}`);

    return item;
  }

  async update(
    id: string,
    updateItemInput: UpdateItemInput,
    user: User,
  ): Promise<Item> {
    await this.findOne(id, user);
    const item = await this.itemsRepositoty.preload(updateItemInput);

    return await this.itemsRepositoty.save(item);
  }

  async remove(id: string, user: User): Promise<Item> {
    const item = await this.findOne(id, user);
    await this.itemsRepositoty.remove(item);

    return { ...item, id };
  }

  async itemsCountByUser(user: User): Promise<number> {
    return await this.itemsRepositoty.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}
