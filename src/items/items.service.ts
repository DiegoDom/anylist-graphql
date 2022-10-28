import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemInput, UpdateItemInput } from './dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepositoty: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput): Promise<Item> {
    const newItem = this.itemsRepositoty.create(createItemInput);
    return await this.itemsRepositoty.save(newItem);
  }

  async findAll(): Promise<Item[]> {
    return await this.itemsRepositoty.find();
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemsRepositoty.findOneBy({ id });

    if (!item)
      throw new NotFoundException(`There is not items with the ID ${id}`);

    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    await this.findOne(id);
    const item = await this.itemsRepositoty.preload(updateItemInput);

    return await this.itemsRepositoty.save(item);
  }

  async remove(id: string): Promise<Item> {
    const item = await this.findOne(id);
    await this.itemsRepositoty.remove(item);

    return { ...item, id };
  }
}
