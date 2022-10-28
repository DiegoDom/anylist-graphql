import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class SignupInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @Field(() => String)
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;
}
