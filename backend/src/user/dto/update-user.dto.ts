import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UpdateUserDto {
  @IsString({ message: 'Name should be string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string

  @IsString({ message: 'Email should be string' })
  @IsEmail({}, { message: 'Wrong email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string

  @IsBoolean({ message: 'isTwoFactorEnabled should be boolean' })
  isTwoFactorEnabled: boolean
}
