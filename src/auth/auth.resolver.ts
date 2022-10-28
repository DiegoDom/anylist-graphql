import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { SigninInput, SignupInput } from './dto';
import { AuthResponse } from './types';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators';
import { User } from '../users/entities';

@Resolver()
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
  @UseGuards(JwtAuthGuard)
  renewJWT(@CurrentUser() user: User): AuthResponse {
    return this.authService.renewJWT(user);
  }
}
