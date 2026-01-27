import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import type { Request } from 'express'

import { ProviderService } from '@/auth/provider/provider.service'

@Injectable()
export class AuthProviderGuard implements CanActivate {
  public constructor(private readonly providerService: ProviderService) {}

  public canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()

    const provider = request.params.provider

    const providerInstance = this.providerService.findByService(provider)

    if (!providerInstance) {
      throw new NotFoundException('Provider not found.')
    }

    return true
  }
}
