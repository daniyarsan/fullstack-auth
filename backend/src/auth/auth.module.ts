import { MailerService } from '@nestjs-modules/mailer'
import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'

import { EmailConfirmationService } from '@/auth/email-confirmation/email-confirmation.service'
import { ProviderModule } from '@/auth/provider/provider.module'
import { TwoFactorAuthService } from '@/auth/two-factor-auth/two-factor-auth.service'
import { getProvidersConfig } from '@/config/providers.config'
import { getRecaptchaConfig } from '@/config/recaptcha.config'
import { UserModule } from '@/user/user.module'
import { UserService } from '@/user/user.service'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [
    UserModule,
    ProviderModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getProvidersConfig,
      inject: [ConfigService]
    }),

    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getRecaptchaConfig,
      inject: [ConfigService]
    }),

    forwardRef(() => EmailConfirmationService)
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, MailerService, TwoFactorAuthService],
  exports: [AuthService]
})
export class AuthModule {}
