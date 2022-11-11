import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';

import { ListsService } from './lists.service';
import { ListItemService } from '../list-item/list-item.service';

import { CreateListInput, UpdateListInput } from './dto/inputs';
import { PaginationsArgs, SearchArgs } from '../common/dto/args';

import { Auth, CurrentUser } from '../auth/decorators';

import { List } from './entities';
import { User } from '../users/entities';
import { ListItem } from '../list-item/entities';

@Resolver(() => List)
@Auth()
export class ListsResolver {
  constructor(
    private readonly listsService: ListsService,
    private readonly listItemService: ListItemService,
  ) {}

  @Mutation(() => List)
  createList(
    @Args('createListInput') createListInput: CreateListInput,
    @CurrentUser() user: User,
  ): Promise<List> {
    return this.listsService.create(createListInput, user);
  }

  @Query(() => [List], { name: 'lists' })
  findAll(
    @CurrentUser() user: User,
    @Args() paginationsArgs: PaginationsArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<List[]> {
    return this.listsService.findAll(user, paginationsArgs, searchArgs);
  }

  @Query(() => List, { name: 'list' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<List> {
    return this.listsService.findOne(id, user);
  }

  @Mutation(() => List)
  updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @CurrentUser() user: User,
  ): Promise<List> {
    return this.listsService.update(updateListInput.id, updateListInput, user);
  }

  @Mutation(() => List)
  removeList(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<List> {
    return this.listsService.remove(id, user);
  }

  @ResolveField(() => [ListItem], { name: 'items' })
  async getListItems(
    @Parent() list: List,
    @Args() paginationsArgs: PaginationsArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<ListItem[]> {
    return await this.listItemService.findAll(
      list,
      paginationsArgs,
      searchArgs,
    );
  }

  @ResolveField(() => Int, { name: 'totalItems' })
  async itemsListsCount(@Parent() list: List): Promise<number> {
    return await this.listItemService.countListItemsByList(list);
  }
}
