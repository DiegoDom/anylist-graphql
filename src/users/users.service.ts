import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { User } from './entities';
import { SignupInput } from '../auth/dto/inputs/signup.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const user = this.usersRepository.create(signupInput);
      return await this.usersRepository.save(user);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`There is not records with ID ${id}`);
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOne({
        where: { email },
        select: {
          id: true,
          email: true,
          fullName: true,
          isActive: true,
          password: true,
          roles: true,
        },
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string): Promise<User> {
    return null;
  }

  private handleExceptions(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key ', ''));
    }

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Unexpected server error, report to admin',
    );
  }
}
