import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { User } from '@prisma/generated/client'
import { TokenType } from '@prisma/generated/enums'
import { v4 as uuidv4 } from 'uuid'

import { MailService } from '@/lib/mail/mail.service'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class TwoFactorAuthService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService
  ) {}

  public async validateTwoFactorToken(email: string, code: string) {
    const existingToken = await this.prismaService.token.findFirst({
      where: {
        email: email,
        type: TokenType.TWO_FACTOR
      }
    })

    if (!existingToken) {
      throw new NotFoundException('Two factor token not found')
    }

    if (existingToken.token !== code) {
      throw new BadRequestException('Wrong code. Please try again')
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date()

    if (hasExpired) {
      throw new BadRequestException(
        'Two factor token expired. Please try again'
      )
    }

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.TWO_FACTOR
      }
    })

    return true
  }

  public async sendTwoFactorToken(email: string) {
    const twoFactorToken = await this.generateTwoFactorToken(email)

    await this.mailService.sendTwoFactorTokenEmail(
      twoFactorToken.email,
      twoFactorToken.token
    )

    return true
  }

  private async generateTwoFactorToken(email: string) {
    const token = Math.floor(
      Math.random() * (1000000 - 100000) + 100000
    ).toString()

    const expiresIn = new Date(new Date().getTime() + 300000)

    const existingToken = await this.prismaService.token.findFirst({
      where: {
        email: email,
        type: TokenType.TWO_FACTOR
      }
    })

    if (existingToken) {
      await this.prismaService.token.delete({
        where: {
          id: existingToken.id,
          type: TokenType.TWO_FACTOR
        }
      })
    }

    return this.prismaService.token.create({
      data: {
        email,
        token,
        expiresIn,
        type: TokenType.TWO_FACTOR
      }
    })
  }
}
