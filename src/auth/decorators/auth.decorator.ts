import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, UserRoleGuard } from '../guards';
import { RoleProtected } from './role-protected.decorator';
import { ValidRoles } from '../enums';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(JwtAuthGuard, UserRoleGuard),
  );
}
