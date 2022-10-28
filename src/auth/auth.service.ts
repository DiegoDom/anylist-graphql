import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';

import { UsersService } from '../users/users.service';
import { User } from '../users/entities';
import { SigninInput, SignupInput } from './dto';

import { AuthResponse } from './types';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    // ? Crear el usuario
    const user = await this.usersService.create({
      ...signupInput,
      password: bcryptjs.hashSync(signupInput.password, 10),
    });

    // ? Generar el JWT
    const jwt = this.getJwt({ uid: user.id });

    return {
      jwt,
      user,
    };
  }

  async login(signinInput: SigninInput): Promise<AuthResponse> {
    const { email, password } = signinInput;

    const user = await this.usersService.findOneByEmail(email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException(
        'There is not records with this credentials',
      );
    }

    if (!bcryptjs.compareSync(password, user.password)) {
      throw new UnauthorizedException(
        'There is not records with this credentials',
      );
    }

    // ? Generar el JWT
    const jwt = this.getJwt({ uid: user.id });

    return {
      jwt,
      user,
    };
  }

  private getJwt(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findOneById(id);

    if (!user) {
      throw new UnauthorizedException(
        'You are not authorized to access this resource',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User does not exist or is not active');
    }

    return user;
  }

  renewJWT(user: User): AuthResponse {
    return { user, jwt: this.getJwt({ uid: user.id }) };
  }
}
