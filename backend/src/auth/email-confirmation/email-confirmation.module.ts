import { MailerService } from '@nestjs-modules/mailer'
import { forwardRef, Module } from '@nestjs/common'

import { AuthModule } from '@/auth/auth.module'
import { MailModule } from '@/lib/mail/mail.module'
import { UserService } from '@/user/user.service'

import { EmailConfirmationController } from './email-confirmation.controller'
import { EmailConfirmationService } from './email-confirmation.service'

@Module({
  imports: [MailModule, forwardRef(() => AuthModule)],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService, UserService, MailerService],
  exports: [EmailConfirmationService]
})
export class EmailConfirmationModule {}
