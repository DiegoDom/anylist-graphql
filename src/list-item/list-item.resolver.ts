import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { ListItemService } from './list-item.service';

import { Auth } from 'src/auth/decorators';

import { ListItem } from './entities';

import { CreateListItemInput, UpdateListItemInput } from './dto/inputs';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(() => ListItem)
@Auth()
export class ListItemResolver {
  constructor(private readonly listItemService: ListItemService) {}

  @Mutation(() => ListItem)
  createListItem(
    @Args('createListItemInput') createListItemInput: CreateListItemInput,
  ): Promise<ListItem> {
    return this.listItemService.create(createListItemInput);
  }

  @Query(() => ListItem, { name: 'listItem' })
  findOne(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
  ): Promise<ListItem> {
    return this.listItemService.findOne(id);
  }

  @Mutation(() => ListItem)
  async updateListItem(
    @Args('updateListItemInput') updateListItemInput: UpdateListItemInput,
  ): Promise<ListItem> {
    return this.listItemService.update(
      updateListItemInput.id,
      updateListItemInput,
    );
  }

  /* 

  

  @Mutation(() => ListItem)
  removeListItem(@Args('id', { type: () => Int }) id: number) {
    return this.listItemService.remove(id);
  } */
}
