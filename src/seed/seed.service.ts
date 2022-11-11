import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ListItem } from '../list-item/entities';
import { ListItemService } from '../list-item/list-item.service';

import { List } from '../lists/entities';
import { ListsService } from '../lists/lists.service';

import { Item } from '../items/entities';
import { ItemsService } from '../items/items.service';

import { User } from '../users/entities';
import { UsersService } from '../users/users.service';

import { SEED_USERS, SEED_ITEMS, SEED_LIST } from './data/seed-data';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    configService: ConfigService,
    @InjectRepository(ListItem)
    private readonly listItemsRepository: Repository<ListItem>,
    private readonly listItemService: ListItemService,

    @InjectRepository(List)
    private readonly listsRepository: Repository<List>,
    private readonly listsService: ListsService,

    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    private readonly itemsService: ItemsService,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly usersService: UsersService,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async executeSeed(): Promise<boolean> {
    //! Bloquear ejecución en modo producción
    if (this.isProd) {
      throw new BadRequestException('We cannot run SEED on Prod');
    }

    //! Limpiar la base de datos
    await this.purgeDatabase();

    //! Crear usuarios
    const user = await this.loadUsers();

    //! Crear items
    await this.loadItems(user);

    //! Crear listas
    const list = await this.loadLists(user);

    //! Crear list items
    const items = await this.itemsService.findAll(
      user,
      { limit: 15, offset: 0 },
      {},
    );
    await this.loadListItems(list, items);

    return true;
  }

  async purgeDatabase(): Promise<void> {
    //! PURGE LIST ITEMS
    await this.listItemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    //! PURGE LIST
    await this.listsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    //! PURGE ITEMS
    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    //! PURGE USERS
    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }

  async loadUsers(): Promise<User> {
    const users = [];

    for (const user of SEED_USERS) {
      users.push(await this.usersService.create(user));
    }

    return users[0];
  }

  async loadItems(user: User): Promise<void> {
    const itemsPromises: Promise<Item>[] = [];

    for (const item of SEED_ITEMS) {
      itemsPromises.push(this.itemsService.create(item, user));
    }

    await Promise.all(itemsPromises);
  }

  async loadLists(user: User): Promise<List> {
    const lists = [];

    for (const list of SEED_LIST) {
      lists.push(await this.listsService.create(list, user));
    }

    return lists[0];
  }

  async loadListItems(list: List, items: Item[]): Promise<void> {
    for (const item of items) {
      await this.listItemService.create({
        quantity: Math.floor(Math.random() * (10 - 1 + 1) + 1),
        completed: Math.round(Math.random() * 1) === 0 ? false : true,
        listId: list.id,
        itemId: item.id,
      });
    }
  }
}
