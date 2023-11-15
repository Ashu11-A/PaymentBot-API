import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'
import { User } from '../entities/user.entity'

export class CreateUserDto extends User {
  @ApiProperty()
  @IsNotEmpty()
    username: string

  @ApiProperty()
  @IsNotEmpty()
    name: string

  @ApiProperty()
  @IsEmail()
    email: string

  @ApiProperty({
    minimum: 6
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
    password: string
}
