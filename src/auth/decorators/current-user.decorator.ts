import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const context = GqlExecutionContext.create(ctx);
    const req = context.getContext().req;

    const user = req.user;

    if (!user) {
      throw new InternalServerErrorException('User not found (request)');
    }

    return data ? user[data] : user;
  },
);
