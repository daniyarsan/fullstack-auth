import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Validate
} from 'class-validator'

import { IsPasswordsMatchingConstraint } from '@/lib/common/decorators/password-matching.decorator'

export class RegisterDto {
  @IsString({ message: 'Имя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя обязательно для заполнения' })
  @MaxLength(50, { message: 'Имя не должно превышать 50 символов' })
  public name: string

  @IsString({ message: 'Электронная почта должна быть строкой' })
  @IsEmail({}, { message: 'Некорректный формат электронной почты' })
  @IsNotEmpty({ message: 'Электронная почта обязательна для заполнения' })
  public email: string

  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязателен для заполнения' })
  @MinLength(6, {
    message: 'Пароль должен содержать не менее 6 символов'
  })
  @MaxLength(128, {
    message: 'Пароль должен содержать не более 128 символов'
  })
  public password: string

  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязателен для заполнения' })
  @MinLength(6, {
    message: 'Пароль должен содержать не менее 6 символов'
  })
  @MaxLength(128, {
    message: 'Пароль должен содержать не более 128 символов'
  })
  @Validate(IsPasswordsMatchingConstraint)
  public passwordRepeat: string
}
