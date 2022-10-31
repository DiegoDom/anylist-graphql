import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { SigninInput, SignupInput } from './dto';
import { AuthResponse } from './types';
import { AuthService } from './auth.service';
import { Auth, CurrentUser } from './decorators';
import { User } from '../users/entities';
import { ValidRoles } from './enums/valid-roles.enum';

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'signup' })
  async signup(
    @Args('signupInput') signupInput: SignupInput,
  ): Promise<AuthResponse> {
    return await this.authService.signup(signupInput);
  }

  @Mutation(() => AuthResponse, { name: 'signin' })
  async login(
    @Args('signinInput') signinInput: SigninInput,
  ): Promise<AuthResponse> {
    return await this.authService.login(signinInput);
  }

  @Query(() => AuthResponse, { name: 'renewJWT' })
  @Auth(ValidRoles.admin)
  renewJWT(@CurrentUser() user: User): AuthResponse {
    return this.authService.renewJWT(user);
  }
}
