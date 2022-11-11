import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field(() => String, { description: 'Product name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => String, {
    description: 'Product unit (gr, ml, k, etc.)',
    nullable: true,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  quantityUnits?: string;
}
