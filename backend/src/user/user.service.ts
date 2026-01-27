import { Injectable, NotFoundException } from '@nestjs/common'
import { AuthMethod } from '@prisma/generated/enums'
import { hash } from 'argon2'

import { PrismaService } from '@/prisma/prisma.service'
import { UpdateUserDto } from '@/user/dto/update-user.dto'

@Injectable()
export class UserService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        accounts: true
      }
    })

    if (!user) {
      throw new NotFoundException('User does not exist')
    }

    return user
  }

  public async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: {
        accounts: true
      }
    })

    return user
  }

  public async create(
    email: string,
    password: string,
    displayName: string,
    avatar: string,
    method: AuthMethod,
    isVerified: boolean
  ) {
    return this.prismaService.user.create({
      data: {
        email,
        password: password ? await hash(password) : '',
        displayName,
        avatar,
        method,
        isVerified
      },

      include: {
        accounts: true
      }
    })
  }

  public async update(userId: string, dto: UpdateUserDto) {
    const user = await this.findById(userId)

    return await this.prismaService.user.update({
      where: {
        id: user.id
      },
      data: {
        email: dto.email,
        displayName: dto.name,
        isTwoFactorEnabled: dto.isTwoFactorEnabled
      }
    })
  }
}
