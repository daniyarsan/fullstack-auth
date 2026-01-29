import { TypeLoginSchema, TypeRegisterSchema } from '@/features/auth/schemas'
import { IUser } from '@/features/auth/types'

import { api } from '@/shared/api'

class AuthService {
  public async register(body: TypeRegisterSchema, recaptcha?: string) {
    const headers = recaptcha ? { recaptcha } : undefined

    return await api.post<IUser>('/auth/register', body, {
      headers
    })
  }

  public async login(body: TypeLoginSchema, recaptcha?: string) {
    const headers = recaptcha ? { recaptcha } : undefined

    return await api.post<IUser>('/auth/login', body, {
      headers
    })
  }

  public async logout() {
    return await api.post('/auth/logout')
  }
}

export const authService = new AuthService()
