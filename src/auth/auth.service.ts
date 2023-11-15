import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'
import { User } from 'src/users/entities/user.entity'
import { UsersService } from '../users/users.service'
import { UserPayload } from './models/UserPayload'
import { UserToken } from './models/UserToken'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ){}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email)

    if (user) {
      // Checar se a senha informada corresponde ao hash do database

      const isPasswordValid = await compare(password, user.password)

      if (isPasswordValid) {
        return {
          ...user,
          password: undefined
        }
      }
    }
    // Se chegar aqui, significa que não encontrou um usuário e/ou a senha não correspondente!
    throw new Error('❌ Email ou Senha invalidos!')
  }

  async login(user: User): Promise<UserToken> {
    // Transforma em um token JWT

    const payload: UserPayload = {
      sub: user.uuid,
      email: user.email,
      name: user.name
    }

    const jwtToken = this.jwtService.sign(payload)

    return {
      accessToken: jwtToken
    }
  }
  /*

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


  async reautenticar(body: { refreshToken: string | undefined }, req: Request, res: Response) {
    const refreshToken = body.refreshToken ?? this.extractTokenFromHeader(req)
    if (!refreshToken || refreshToken === 'undefined') throw new NotFoundException('❌ Token não expecificado, token: ' + refreshToken)

    console.log(refreshToken)

    const { uuid } = this.jwtService.decode(refreshToken)
    if (!uuid) throw new UnauthorizedException('❌ Token Quebrado')

    const user = await this.usersService.findByUUID(uuid)
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
    */
}

