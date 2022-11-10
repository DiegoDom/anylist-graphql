import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';

import { User } from './entities';
import { SignupInput } from '../auth/dto/inputs/signup.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/inputs/update-user.input';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const user = this.usersRepository.create({
        ...signupInput,
        password: bcryptjs.hashSync(signupInput.password, 10),
      });
      return await this.usersRepository.save(user);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    updatedBy: User,
  ): Promise<User> {
    try {
      await this.findOneById(id);

      const user = await this.usersRepository.preload({
        ...updateUserInput,
        id,
      });

      user.lastUpdatedBy = updatedBy;

      user.password = updateUserInput.password
        ? bcryptjs.hashSync(updateUserInput.password, 10)
        : user.password;

      return await this.usersRepository.save(user);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    try {
      if (roles.length === 0) {
        return await this.usersRepository.find();
      }

      return await this.usersRepository
        .createQueryBuilder()
        .andWhere('ARRAY[roles] && ARRAY[:...roles]')
        .setParameter('roles', roles)
        .getMany();
    } catch (error) {
      this.handleExceptions(error);
    }
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

  async remove(id: string, user: User): Promise<User> {
    const userToBlock = await this.findOneById(id);

    userToBlock.isActive = false;
    userToBlock.lastUpdatedBy = user;

    return await this.usersRepository.save(userToBlock);
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
