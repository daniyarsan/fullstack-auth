import { ConfigService } from '@nestjs/config'
import { GoogleRecaptchaModuleOptions } from '@nestlab/google-recaptcha'

import { isDev } from '@/lib/common/utils/is-dev'

export const getRecaptchaConfig = (
  configService: ConfigService
): GoogleRecaptchaModuleOptions => ({
  secretKey: configService.getOrThrow<string>('GOOGLE_RECAPTCHA_SECRET_KEY'),
  response: req => req.headers.recaptcha(),
  skipIf: isDev(configService)
})
