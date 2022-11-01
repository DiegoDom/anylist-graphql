import { registerEnumType } from '@nestjs/graphql';

export enum ValidRoles {
  admin = 'admin',
  user = 'user',
  sales = 'sales',
}

registerEnumType(ValidRoles, {
  name: 'ValidRoles',
  description: 'They are the valid roles that users can belong to.',
});
