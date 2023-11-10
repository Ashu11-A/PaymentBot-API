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
import { JwtGuard, SkipAuth } from './guards/jwt.guard'
import { Response, Request } from 'express'
import { User } from '@prisma/client'

@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async create (@Body() createUser: CreateUserDto) {
    return this.authService.create(createUser)
  }

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login (@Body() loginUser: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(loginUser, res)
  }

  @SkipAuth()
  @Post('refresh')
  reautenticar(@Body() body, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.reautenticar(body, req, res)
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  getProfile(@Req() req) {
    const { name, email, idPermission, created_at, updated_at } = req.user as User
    return { name, email, idPermission, created_at, updated_at }
  }
}
