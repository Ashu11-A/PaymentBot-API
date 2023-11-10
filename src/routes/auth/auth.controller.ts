import {
  Controller,
  Post,
  Body,
  HttpCode,
  Res,
  HttpStatus,
  UseGuards,
  Get,
  Req
} from '@nestjs/common'

import { AuthService } from './auth.service'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { AuthGuard, SkipAuth } from './auth.guard'
import { Response, Request } from 'express'

@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Post('registro')
  async create (@Body() createUser: CreateUserDto) {
    return this.authService.create(createUser)
  }

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login (@Body() loginUser: LoginUserDto, @Res() res: Response) {
    return this.authService.login(loginUser, res)
  }

  @SkipAuth()
  @Post('refresh')
  reautenticar(@Body() body, @Req() req: Request, @Res() res: Response) {
    return this.authService.reautenticar(body, req, res)
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user
  }
}
