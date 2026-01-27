import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { User } from '@prisma/generated/client'
import { TokenType } from '@prisma/generated/enums'
import { Request } from 'express'
import { v4 as uuidv4 } from 'uuid'

import { AuthService } from '@/auth/auth.service'
import { ConfirmationDto } from '@/auth/email-confirmation/dto/confirmation.dto'
import { MailService } from '@/lib/mail/mail.service'
import { PrismaService } from '@/prisma/prisma.service'
import { UserService } from '@/user/user.service'

@Injectable()
export class EmailConfirmationService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ) {}

  public async newVerification(req: Request, dto: ConfirmationDto) {
    const existingToken = await this.prismaService.token.findUnique({
      where: {
        token: dto.token,
        type: TokenType.VERIFICATION
      }
    })

    if (!existingToken) {
      throw new NotFoundException('Confirmation token not found')
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date()

    if (hasExpired) {
      throw new BadRequestException(
        'Confirmation token expired. Please try again later'
      )
    }

    const existingUser = await this.userService.findByEmail(existingToken.email)
    if (!existingUser) {
      throw new NotFoundException('User with defined email was not found')
    }

    await this.prismaService.user.update({
      where: {
        id: existingUser.id
      },
      data: {
        isVerified: true
      }
    })

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.VERIFICATION
      }
    })

    return this.authService.saveSession(req, existingUser)
  }

  public async sendVerificationToken(email: string) {
    const verificationToken = await this.generateVerificationToken(email)

    await this.mailService.sendConfirmationEmail(
      verificationToken.email,
      verificationToken.token
    )

    return true
  }

  private async generateVerificationToken(email: string) {
    const token = uuidv4()
    const expiresIn = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await this.prismaService.token.findFirst({
      where: {
        email: email,
        type: TokenType.VERIFICATION
      }
    })

    if (existingToken) {
      await this.prismaService.token.delete({
        where: {
          id: existingToken.id,
          type: TokenType.VERIFICATION
        }
      })
    }

    return this.prismaService.token.create({
      data: {
        email,
        token,
        expiresIn,
        type: TokenType.VERIFICATION
      }
    })
  }
}
