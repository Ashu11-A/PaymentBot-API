import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Get,
  UseGuards
} from '@nestjs/common'

import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { AuthService } from './auth.service'
import { IsPublic } from './decorator/pass.decorator'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { AuthRequest } from './models/AuthRequest'
import { AccessTokenGuard } from './guards/accessToken.guard'
import { RefreshTokenGuard } from './guards/refreshToken.guard'
import { UserPayload } from './models/UserPayload'
@IsPublic()
@Controller('auth')
export class AuthController {
  constructor (
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async create (@Body() signUpDto: CreateUserDto) {
    return await this.authService.create(signUpDto)
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login (@Req() req: AuthRequest) {
    return this.authService.login(req.user)
  }

  @IsPublic(false)
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(@Req() req: AuthRequest) {
    return this.authService.logout(req.user['uuid'])
  }

  @IsPublic()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: { user: UserPayload }) {
    const payload = req.user
    const refreshToken = req.user['refreshToken']
    return this.authService.refreshToken(payload, refreshToken)
  }
}
