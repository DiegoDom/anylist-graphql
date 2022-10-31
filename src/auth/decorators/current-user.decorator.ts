import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ValidRoles } from '../enums/valid-roles.enum';
import { User } from '../../users/entities';

export const CurrentUser = createParamDecorator(
  (roles: ValidRoles[] = [], ctx: ExecutionContext) => {
    const context = GqlExecutionContext.create(ctx);
    const req = context.getContext().req;

    const user = req.user as User;

    if (!user) {
      throw new InternalServerErrorException('User not found (request)');
    }

    if (!roles) return user;
    if (roles.length === 0) return user;

    for (const role of user.roles) {
      if (roles.includes(role as ValidRoles)) {
        return user;
      }
    }

    throw new ForbiddenException(
      `${user.fullName} you are not authorized to access this resource`,
    );
  },
);
