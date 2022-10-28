import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities';

@ObjectType()
export class AuthResponse {
  @Field(() => String)
  jwt: string;

  @Field(() => User)
  user: User;
}
