import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateItemInput, UpdateItemInput } from './dto';
import { User } from '../users/entities';
import { Item } from './entities/item.entity';

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

  async findAll(user: User): Promise<Item[]> {
    return await this.itemsRepositoty.find({
      where: { user: { id: user.id } },
    });
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
