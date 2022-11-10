import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@ArgsType()
export class SearchArgs {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Field(() => String, {
    description: 'Search term for filter elements',
    nullable: true,
  })
  search?: string;
}
