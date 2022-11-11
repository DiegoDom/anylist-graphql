import { InputType, Field, Float, ID } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
  Min,
} from 'class-validator';

@InputType()
export class CreateListItemInput {
  @Field(() => Float, { description: 'List Item quantity', nullable: true })
  @IsOptional()
  @IsPositive()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must contain max two decimal places' },
  )
  @Min(1)
  quantity = 1;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  completed = false;

  @Field(() => ID)
  @IsUUID()
  listId: string;

  @Field(() => ID)
  @IsUUID()
  itemId: string;
}
