import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateListInput, UpdateListInput } from './dto/inputs';
import { PaginationsArgs, SearchArgs } from '../common/dto/args';

import { List } from './entities';
import { User } from '../users/entities';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private readonly listsRepository: Repository<List>,
  ) {}

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const newList = this.listsRepository.create({ ...createListInput, user });
    return await this.listsRepository.save(newList);
  }

  async findAll(
    user: User,
    paginationsArgs: PaginationsArgs,
    searchArgs: SearchArgs,
  ): Promise<List[]> {
    const { limit, offset } = paginationsArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listsRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, { userId: user.id });

    if (search) {
      queryBuilder.andWhere('LOWER(name) like :name', {
        name: `%${search.toLowerCase()}%`,
      });
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = await this.listsRepository.findOneBy({
      id,
      user: { id: user.id },
    });

    if (!list) {
      throw new NotFoundException(`There is not records with the ID ${id}`);
    }

    return list;
  }

  async update(
    id: string,
    updateListInput: UpdateListInput,
    user: User,
  ): Promise<List> {
    await this.findOne(id, user);
    const list = await this.listsRepository.preload(updateListInput);

    return await this.listsRepository.save(list);
  }

  async remove(id: string, user: User): Promise<List> {
    const list = await this.findOne(id, user);
    await this.listsRepository.remove(list);

    return { ...list, id };
  }

  async listsCountByUser(user: User): Promise<number> {
    return await this.listsRepository.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}
