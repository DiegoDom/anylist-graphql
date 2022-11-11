import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';

import { ListItemModule } from '../list-item/list-item.module';

import { List } from './entities';

@Module({
  providers: [ListsResolver, ListsService],
  imports: [TypeOrmModule.forFeature([List]), ListItemModule],
  exports: [ListsService, TypeOrmModule],
})
export class ListsModule {}
