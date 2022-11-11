import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateListItemInput, UpdateListItemInput } from './dto/inputs';
import { PaginationsArgs, SearchArgs } from '../common/dto/args';

import { ListItem } from './entities';
import { List } from '../lists/entities';

@Injectable()
export class ListItemService {
  constructor(
    @InjectRepository(ListItem)
    private readonly listItemsRepository: Repository<ListItem>,
  ) {}

  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { itemId, listId, ...rest } = createListItemInput;

    const newListItem = this.listItemsRepository.create({
      ...rest,
      item: { id: itemId },
      list: { id: listId },
    });

    await this.listItemsRepository.save(newListItem);

    return this.findOne(newListItem.id);
  }

  async findAll(
    list: List,
    paginationsArgs: PaginationsArgs,
    searchArgs: SearchArgs,
  ): Promise<ListItem[]> {
    const { limit, offset } = paginationsArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listItemsRepository
      .createQueryBuilder('listItem')
      .innerJoin('listItem.item', 'item')
      .take(limit)
      .skip(offset)
      .where(`"listId" = :listId`, { listId: list.id });

    if (search) {
      // ? Añadir el item.name para hacer la referencia a que el nombre esta en el item
      queryBuilder.andWhere('LOWER(item.name) like :name', {
        name: `%${search.toLowerCase()}%`,
      });
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<ListItem> {
    const listItem = await this.listItemsRepository.findOneBy({ id });

    if (!listItem)
      throw new NotFoundException(`There is not list items with the ID ${id}`);

    return listItem;
  }

  async update(
    id: string,
    updateListItemInput: UpdateListItemInput,
  ): Promise<ListItem> {
    await this.findOne(id);

    const { itemId, listId, ...rest } = updateListItemInput;

    const queryBuilder = this.listItemsRepository
      .createQueryBuilder()
      .update()
      .set(rest)
      .where('id = :id', { id });

    if (listId) queryBuilder.set({ list: { id: listId } });
    if (itemId) queryBuilder.set({ item: { id: itemId } });

    await queryBuilder.execute();

    return await this.findOne(id);
  }

  /* 

  

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  } */

  async countListItemsByList(list: List): Promise<number> {
    return await this.listItemsRepository.count({
      where: {
        list: {
          id: list.id,
        },
      },
    });
  }
}
