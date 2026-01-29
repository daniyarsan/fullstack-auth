import { TypeRegisterSchema } from '@/features/auth/schemas'
import { TypeResetPasswordSchema } from '@/features/auth/schemas/reset-password.schema'
import { IUser } from '@/features/auth/types'

import { api } from '@/shared/api'

class PasswordRecoveryService {
  public async reset(body: TypeResetPasswordSchema, recaptcha?: string) {
    const headers = recaptcha ? { recaptcha } : undefined

    return await api.post<IUser>('/auth/password-recovery/reset', body, {
      headers
    })
  }
}

export const passwordRecoveryService = new PasswordRecoveryService()
