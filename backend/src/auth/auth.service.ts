import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User } from '@prisma/generated/client'
import { AuthMethod } from '@prisma/generated/enums'
import { verify } from 'argon2'
import { Request, Response } from 'express'

import { LoginDto } from '@/auth/dto/login.dto'
import { RegisterDto } from '@/auth/dto/register.dto'
import { EmailConfirmationService } from '@/auth/email-confirmation/email-confirmation.service'
import { ProviderService } from '@/auth/provider/provider.service'
import { TwoFactorAuthService } from '@/auth/two-factor-auth/two-factor-auth.service'
import { PrismaService } from '@/prisma/prisma.service'
import { UserService } from '@/user/user.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService,
    private readonly prismaService: PrismaService,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly twoFactorAuthService: TwoFactorAuthService
  ) {}

  public async register(req: Request, dto: RegisterDto) {
    const isExists = await this.userService.findByEmail(dto.email)
    if (isExists) {
      throw new ConflictException('Email already exists')
    }

    const newUser = await this.userService.create(
      dto.email,
      dto.password,
      dto.name,
      '',
      AuthMethod.CREDEMTIALS,
      false
    )
    await this.emailConfirmationService.sendVerificationToken(newUser.email)
    return {
      message: 'Registered successfully. Please confirm email address'
    }
  }

  public async login(req: Request, dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email)
    if (!user || !user.password) {
      throw new NotFoundException('User not found')
    }

    const isValidPassword = await verify(user.password, dto.password)
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password')
    }

    if (!user.isVerified) {
      await this.emailConfirmationService.sendVerificationToken(user.email)
      throw new UnauthorizedException(
        'Email is not verified. Please check email and verify again.'
      )
    }

    if (user.isTwoFactorEnabled) {
      if (!dto.code) {
        await this.twoFactorAuthService.sendTwoFactorToken(user.email)

        return {
          message: 'Please check your email box. Two factor code is required'
        }
      }

      await this.twoFactorAuthService.validateTwoFactorToken(
        user.email,
        dto.code
      )
    }

    return this.saveSession(req, user)
  }

  public async extractProfileFromCode(
    req: Request,
    provider: string,
    code: string
  ) {
    const providerInstance = this.providerService.findByService(provider)
    const profile = await providerInstance.findUserByCode(code)
    const account = await this.prismaService.account.findFirst({
      where: {
        id: profile.id,
        provider: profile.provider
      }
    })

    let user = account?.userId
      ? await this.userService.findById(account.userId)
      : null

    if (user) {
      return this.saveSession(req, user)
    }

    user = await this.userService.create(
      profile.email,
      '',
      profile.name,
      profile.avatar,
      AuthMethod[profile.provider.toUpperCase()],
      true
    )

    if (!account) {
      await this.prismaService.account.create({
        data: {
          userId: user.id,
          type: 'oauth',
          provider: profile.provider,
          accessToken: profile.access_token,
          refreshToken: profile.refresh_token,
          expiresAt: profile.expires_at
        }
      })
    }
    return this.saveSession(req, user)
  }

  public async logout(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy(err => {
        if (err) {
          return reject(
            new InternalServerErrorException("Can't delete session")
          )
        }

        res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'))
        resolve()
      })
    })
  }

  public saveSession(req: Request, user: User) {
    console.log('saving session')
    return new Promise((resolve, reject) => {
      req.session.userId = user.id
      req.session.save((err: any) => {
        if (err)
          return reject(new InternalServerErrorException('Session save error'))
      })
      resolve(user)
    })
  }
}
