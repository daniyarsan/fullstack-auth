import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req
} from '@nestjs/common'
import { Request } from 'express'

import { ConfirmationDto } from '@/auth/email-confirmation/dto/confirmation.dto'

import { EmailConfirmationService } from './email-confirmation.service'

@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService
  ) {}

  @Post('auth/email-confirmation')
  @HttpCode(HttpStatus.OK)
  public async newVerification(
    @Req() req: Request,
    @Body() dto: ConfirmationDto
  ) {
    return this.emailConfirmationService.newVerification(req, dto)
  }
}
