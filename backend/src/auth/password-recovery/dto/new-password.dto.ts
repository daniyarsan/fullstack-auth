import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class NewPasswordDto {
  @IsString({ message: 'Password should be a string' })
  @MinLength(6, { message: 'Password should be more than 6 symbols' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string
}
