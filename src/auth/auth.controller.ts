import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'

import { Request, Response } from 'express'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { UsersService } from 'src/users/users.service'
import { AuthService } from './auth.service'
import { IsPublic } from './decorator/pass.decorator'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { AuthRequest } from './models/AuthRequest'

@UseGuards(LocalAuthGuard)
@IsPublic()
@Controller('auth')
export class AuthController {
  constructor (
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) {}

  @Post('signup')
  async create (@Body() signUpDto: CreateUserDto) {
    return await this.userService.create(signUpDto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login (@Req() req: AuthRequest) {
    return this.authService.login(req.user)
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  reautenticar(@Body() body, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    // return this.authService.reautenticar(body, req, res)
  }
}
