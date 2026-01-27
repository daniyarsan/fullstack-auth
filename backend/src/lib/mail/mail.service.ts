import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'

import { ConfirmationTemplate } from '@/lib/mail/templates/confirmation.template'
import { ResetPasswordTemplate } from '@/lib/mail/templates/reset-password.template'
import { TwoFactorTemplate } from '@/lib/mail/templates/two-factor.template'

@Injectable()
export class MailService {
  public constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {}

  public async sendConfirmationEmail(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOW_ORIGIN')
    const html = await render(ConfirmationTemplate({ domain, token }))

    return this.sendMail(email, 'Email confirmation', html)
  }

  public async sendPasswordResetEmail(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOW_ORIGIN')
    const html = await render(ResetPasswordTemplate({ domain, token }))

    return this.sendMail(email, 'Password reset', html)
  }

  public async sendTwoFactorTokenEmail(email: string, token: string) {
    const html = await render(TwoFactorTemplate({ token }))

    return this.sendMail(email, 'Two Factor Conirmation', html)
  }

  private sendMail(email: string, subject: string, html: string) {
    return this.mailerService.sendMail({
      to: email,
      subject: subject,
      html: html
    })
  }
}
