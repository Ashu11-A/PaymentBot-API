import {
  Controller,
  Post,
  Body,
  HttpCode,
  Res,
  HttpStatus,
  Req
} from '@nestjs/common'

import { AuthService } from './auth.service'
import { SignUpDto } from './dto/signUp-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { Response, Request } from 'express'
import { Public } from './pass.decorator'

@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async create (@Body() signUpDto: SignUpDto) {
    return this.authService.create(signUpDto)
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login (@Body() loginUser: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(loginUser, res)
  }

  @Public()
  @Post('refresh')
  reautenticar(@Body() body, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.reautenticar(body, req, res)
  }
}
