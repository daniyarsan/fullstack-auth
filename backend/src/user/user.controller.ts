import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch
} from '@nestjs/common'
import { User, UserRole } from '@prisma/generated/client'

import { Auth } from '@/auth/decorators/auth.decorator'
import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { UpdateUserDto } from '@/user/dto/update-user.dto'

import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  public async findProfile(@CurrentUser('id') id: string): Promise<User> {
    return await this.userService.findById(id)
  }

  @Auth(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('profile/:id')
  public async findById(@Param('id') id: string): Promise<User> {
    return await this.userService.findById(id)
  }

  @Auth(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Patch('profile')
  public async updateProfile(
    @CurrentUser('id') id: string,
    @Body() dto: UpdateUserDto
  ): Promise<User> {
    return await this.userService.update(id, dto)
  }
}
