import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { compare } from 'bcrypt'
import { LoginException } from './exception/login.exception'
import { type CreateUserDto } from './dto/create-user.dto'
import { type LoginUserDto } from './dto/login-user.dto'
import type { Response } from 'express'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ){}

  async create(data: CreateUserDto) {
    await this.usersService.create(data)
    return { status: 'success', message: '✅ Conta criada com sucesso!'}
  }

  async login (data: LoginUserDto, res: Response) {
    const { email, password } = data
    const user = await this.usersService.findOne({ email })
    if (!user) throw new LoginException()

    const passwordVerify = compare(password, user.password)
    if (!passwordVerify) throw new LoginException()

    const [accessToken, refreshToken] = await this.genTokens({ uuid: user.uuid })

    res.set('X-access-token', accessToken)
    res.set('X-refresh-token', refreshToken)
    return {
      status: 'success',
      message: '✅ Logado com sucesso!',
      user: {
        name: user.name,
        email: user.email
      },
      tokens: {
        accessToken,
        refreshToken
      }
    }
  }

  async reautenticar(body: { refreshToken: string }, req: Request, res: Response) {
    const refreshToken = body.refreshToken ?? this.extractTokenFromHeader(req)
    if (!refreshToken) throw new NotFoundException('❌ Token não expecificado')

    const { uuid } = this.jwtService.decode(refreshToken)
    if (!uuid) throw new UnauthorizedException('❌ Token Quebrado')

    const user = await this.usersService.findOne({ uuid })
    if (!user) throw new NotFoundException('❌ Usuário não encontrado')

    try {
      this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH'),
      })

      const [accessToken, newRefreshToken] = await this.genTokens({ uuid })

      res.set('X-access-token', accessToken)
      res.set('X-refresh-token', newRefreshToken)

      return { status: 'success', message: '✅ Relogado com sucesso!', accessToken, refreshToken }
    } catch (err) {
      if (err.name === 'JsonWebTokenError')  throw new UnauthorizedException('❌ Assinatura Inválida')
      if (err.name === 'TokenExpiredError') throw new UnauthorizedException('❌ Token Expirado')
      throw new UnauthorizedException(err.name)
    }
  }

  private async genTokens (payload: {
    uuid: string
  }) {
    const { uuid } = payload

    const accessToken = await this.jwtService.signAsync({ uuid })
    const refreshToken  = await this.jwtService.signAsync({ uuid }, {
      secret: this.configService.get('JWT_REFRESH'),
      expiresIn: this.configService.get('JWT_EXP_R')
    })

    return [accessToken, refreshToken]
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Refresh' ? token : undefined
  }
}
