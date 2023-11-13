import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class SignUpDto {
  @ApiProperty()
  @IsNotEmpty()
    name: string

  @ApiProperty()
  @IsEmail()
    email: string

  @ApiProperty({
    minimum: 6
  })
  @IsNotEmpty()
  @MinLength(6)
    password: string
}
