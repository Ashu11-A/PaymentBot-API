import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from 'src/database/prismaService'
import { compare, genSalt, hash } from 'bcrypt'
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
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService
  ){}

  async create(data: CreateUserDto) {
    const { email, name, password} = data

    const userExist = await this.usersService.findOne({ email })
    if (userExist) throw new HttpException('❌ Usuário já existe!', HttpStatus.CONFLICT)

    const salt = await genSalt(10)
    const passwordHash = await hash(password, salt)
    const permissions = await this.prisma.permission.upsert({
      where: { name: 'user' },
      update: {},
      create: {
        name: 'user',
        level: 0
      }
    })

    await this.usersService.create({
      name,
      email,
      password: passwordHash,
      idPermission: permissions.id
    })

    return { status: 'completed', message: '✅ Conta criada com sucesso!'}
  }

  async login (data: LoginUserDto, res: Response) {
    const { email, password } = data
    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    })
    if (!user) throw new LoginException()

    const passwordVerify = compare(password, user.password)
    if (!passwordVerify) throw new LoginException()

    const [accessToken, refreshToken] = await this.genTokens({ uuid: user.uuid })

    res.set('X-access-token', accessToken)
    res.set('X-refresh-token', refreshToken)
    res.status(200).json({ status: 'completed', message: '✅ Logado com sucesso!', accessToken, refreshToken }).send()
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
      res.status(200).json({ status: 'completed', message: '✅ Relogado com sucesso!', accessToken, refreshToken }).send()
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
      expiresIn: '12h'
    })

    return [accessToken, refreshToken]
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
