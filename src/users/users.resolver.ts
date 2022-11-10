import { ParseUUIDPipe } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Int,
  Parent,
} from '@nestjs/graphql';

import { UsersService } from './users.service';
import { ItemsService } from '../items/items.service';

import { PaginationsArgs, SearchArgs } from '../common/dto/args';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { UpdateUserInput } from './dto/inputs';

import { User } from './entities/user.entity';
import { Item } from '../items/entities';

import { Auth, CurrentUser } from '../auth/decorators';
import { ValidRoles } from '../auth/enums';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
  ) {}

  @Query(() => [User], { name: 'users' })
  @Auth(ValidRoles.admin)
  findAll(@Args() validRoles: ValidRolesArgs): Promise<User[]> {
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  @Auth(ValidRoles.admin)
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<User> {
    return await this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  @Auth(ValidRoles.admin)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() user: User,
  ): Promise<User> {
    return await this.usersService.update(
      updateUserInput.id,
      updateUserInput,
      user,
    );
  }

  @Mutation(() => User, { name: 'removeUser' })
  @Auth(ValidRoles.admin)
  removeUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.usersService.remove(id, user);
  }

  @ResolveField(() => Int, { name: 'itemCount' })
  async itemCount(@Parent() user: User): Promise<number> {
    return await this.itemsService.itemsCountByUser(user);
  }

  @ResolveField(() => [Item], { name: 'items' })
  async getUserItems(
    @Parent() user: User,
    @Args() paginationsArgs: PaginationsArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Item[]> {
    return await this.itemsService.findAll(user, paginationsArgs, searchArgs);
  }
}
