import { applyDecorators, UseGuards } from '@nestjs/common'
import { UserRole } from '@prisma/generated/enums'

import { Roles } from '@/auth/decorators/roles.decorator'
import { AuthGuard } from '@/auth/guard/auth.guard'
import { RolesGuard } from '@/auth/guard/roles.guard'

export function Auth(...roles: UserRole[]) {
  if (roles.length > 0) {
    return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard))
  }

  return applyDecorators(UseGuards(AuthGuard))
}
