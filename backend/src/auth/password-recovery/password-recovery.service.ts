import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { TokenType } from '@prisma/generated/enums'
import { hash } from 'argon2'
import { v4 as uuidv4 } from 'uuid'

import { NewPasswordDto } from '@/auth/password-recovery/dto/new-password.dto'
import { ResetPasswordDto } from '@/auth/password-recovery/dto/reset-password.dto'
import { MailService } from '@/lib/mail/mail.service'
import { PrismaService } from '@/prisma/prisma.service'
import { UserService } from '@/user/user.service'

@Injectable()
export class PasswordRecoveryService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly mailService: MailService
  ) {}

  public async resetPassword(dto: ResetPasswordDto) {
    const existingUser = await this.userService.findByEmail(dto.email)

    if (!existingUser) {
      throw new NotFoundException('User not found. Please check email address')
    }

    const passwordResetToken = await this.generatePasswordResetToken(
      existingUser.email
    )

    await this.mailService.sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token
    )

    return true
  }

  public async newPassword(dto: NewPasswordDto, token: string) {
    const existingToken = await this.prismaService.token.findFirst({
      where: {
        token,
        type: TokenType.PASSWORD_RESET
      }
    })

    if (!existingToken) {
      throw new NotFoundException('Token not found. Please check email address')
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date()

    if (hasExpired) {
      throw new BadRequestException(
        'New password token has expired. Please try again. '
      )
    }

    const existingUser = await this.userService.findByEmail(existingToken.email)

    if (!existingUser) {
      throw new NotFoundException(
        'User with defined email was not found. Please check email and try again'
      )
    }

    await this.prismaService.user.update({
      where: {
        id: existingUser.id
      },
      data: {
        password: await hash(dto.password)
      }
    })

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.PASSWORD_RESET
      }
    })

    return true
  }

  private async generatePasswordResetToken(email: string) {
    const token = uuidv4()
    const expiresIn = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await this.prismaService.token.findFirst({
      where: {
        email: email,
        type: TokenType.PASSWORD_RESET
      }
    })

    if (existingToken) {
      await this.prismaService.token.delete({
        where: {
          id: existingToken.id,
          type: TokenType.PASSWORD_RESET
        }
      })
    }

    return this.prismaService.token.create({
      data: {
        email,
        token,
        expiresIn,
        type: TokenType.PASSWORD_RESET
      }
    })
  }
}
