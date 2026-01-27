import { FactoryProvider, ModuleMetadata } from '@nestjs/common'

import { BaseOAuthService } from '@/auth/provider/services/base-oauth.service'

export const ProviderOptionsSymbol = Symbol()

export type TypeOptions = {
  baseUrl?: string
  serices: BaseOAuthService[]
}

export type TypeAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<TypeOptions>, 'useFactory' | 'inject'>
