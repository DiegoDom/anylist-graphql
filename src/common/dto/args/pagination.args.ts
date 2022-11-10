import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

@ArgsType()
export class PaginationsArgs {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Field(() => Int, {
    description: 'Pagination offset to skip elements',
    nullable: true,
    defaultValue: 0,
  })
  offset = 0;

  @IsOptional()
  @IsPositive()
  @IsInt()
  @Min(1)
  @Field(() => Int, {
    description: 'Pagination limit of elements',
    nullable: true,
    defaultValue: 10,
  })
  limit = 10;
}
