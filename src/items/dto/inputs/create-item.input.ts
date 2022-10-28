import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field(() => String, { description: 'Product name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => Float, { description: 'Product quantity' })
  @IsPositive()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must contain max two decimal places' },
  )
  @Min(1)
  quantity: number;

  @Field(() => String, {
    description: 'Product unit (gr, ml, k, etc.)',
    nullable: true,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  quantityUnits?: string;
}
