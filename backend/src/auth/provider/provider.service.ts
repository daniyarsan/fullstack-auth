import { Inject, Injectable, OnModuleInit } from '@nestjs/common'

import {
  ProviderOptionsSymbol,
  TypeOptions
} from '@/auth/provider/provider.contants'
import { BaseOAuthService } from '@/auth/provider/services/base-oauth.service'

@Injectable()
export class ProviderService implements OnModuleInit {
  public constructor(
    @Inject(ProviderOptionsSymbol) private readonly options: TypeOptions
  ) {}

  public onModuleInit(): any {
    for (const provider of this.options.serices) {
      provider.baseUrl = this.options.baseUrl
    }
  }

  public findByService(service: string): BaseOAuthService | null {
    return this.options.serices.find(s => s.name === service)
  }
}
