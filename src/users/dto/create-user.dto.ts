import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'
import { User } from '../entities/user.entity'

export class CreateUserDto extends User {
  @IsNotEmpty()
    username: string

  @IsNotEmpty()
    name: string

  @IsEmail()
    email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
    password: string
}
