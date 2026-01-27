import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import type { Request } from 'express'

import { UserService } from '@/user/user.service'

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly userService: UserService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>() as Request
    const userId = request.session.userId

    if (typeof userId === 'undefined') {
      throw new UnauthorizedException('You are not authenticated')
    }

    request.user = await this.userService.findById(userId)

    return true
  }
}
