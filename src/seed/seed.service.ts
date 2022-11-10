import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Item } from '../items/entities';
import { ItemsService } from '../items/items.service';

import { User } from '../users/entities';
import { UsersService } from '../users/users.service';

import { SEED_USERS, SEED_ITEMS } from './data/seed-data';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    configService: ConfigService,
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

    return true;
  }

  async purgeDatabase(): Promise<void> {
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
}
