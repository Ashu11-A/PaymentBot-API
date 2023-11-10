import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from 'src/database/prismaService'
import { compare } from 'bcrypt'
import { LoginException } from 'src/exception/login.exception'
import { type CreateUserDto } from './dto/create-user.dto'
import { type LoginUserDto } from './dto/login-user.dto'
import type { Response } from 'express'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { jwtConstants } from './constants'
import { Request } from 'express'

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ){}

  async create(data: CreateUserDto) {
    await this.usersService.create(data)
    return { status: 'completed', message: '✅ Conta criada com sucesso!'}
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
    return { status: 'completed', message: '✅ Logado com sucesso!', accessToken, refreshToken }
  }

  async reautenticar(body: { refreshToken: string }, req: Request, res: Response) {
    const refreshToken = body.refreshToken ?? this.extractTokenFromHeader(req)
    if (!refreshToken) throw new NotFoundException('❌ Token não expecificado')

    const { uuid } = this.jwtService.decode(refreshToken)
    if (!uuid) throw new UnauthorizedException('❌ Token Quebrado')

    const user = await this.usersService.findOne({ uuid })
    console.log(user)
    if (!user) throw new NotFoundException('❌ Usuário não encontrado')

    try {
      this.jwtService.verify(refreshToken, {
        secret: jwtConstants.secretRefresh,
      })

      const [accessToken, newRefreshToken] = await this.genTokens({ uuid })

      res.set('X-access-token', accessToken)
      res.set('X-refresh-token', newRefreshToken)

      return { status: 'completed', message: '✅ Relogado com sucesso!', accessToken, refreshToken }
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('❌ Assinatura Inválida')
      }
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('❌ Token Expirado')
      }
      throw new UnauthorizedException(err.name)
    }
  }

  private async genTokens (payload: {
    uuid: string
  }) {
    const { uuid } = payload

    const accessToken = await this.jwtService.signAsync({ uuid })
    const refreshToken  = await this.jwtService.signAsync({ uuid }, {
      secret: jwtConstants.secretRefresh,
      expiresIn: '7d'
    })

    return [accessToken, refreshToken]
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
