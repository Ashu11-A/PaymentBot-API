import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { compare, genSalt, hash, hashSync } from 'bcrypt'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { User } from 'src/users/entities/user.entity'
import { UsersService } from '../users/users.service'
import { UserPayload } from './models/UserPayload'
import { UserToken } from './models/UserToken'
import { Prisma } from '@prisma/client'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) { }

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

  async create (createUserDto: CreateUserDto) {
    const emailExist = await this.usersService.findByEmail(createUserDto.email)
    if (emailExist) throw new HttpException('❌ Usuário já existe!', HttpStatus.CONFLICT)

    const salt = await genSalt(10)

    const data: Prisma.UserCreateInput = {
      ...createUserDto,
      permission: {
        connect: { name: 'user' },
        connectOrCreate: {
          where: {
            name: 'user'
          },
          create: {
            name: 'user',
            level: 0
          }
        }
      },
      password: hashSync(createUserDto.password, salt)
    }
    const newUser = await this.usersService.create(data)

    const payload: UserPayload = {
      sub: newUser.uuid,
      email: newUser.email,
      name: newUser.name
    }

    const tokens = await this.genTokens(payload)
    await this.updateRefreshToken(payload.sub, tokens.refreshToken)
    return tokens
  }

  async login(user: User): Promise<UserToken> {
    // Transforma em um token JWT
    const payload: UserPayload = {
      sub: user.uuid,
      email: user.email,
      name: user.name
    }

    const { accessToken, refreshToken } = await this.genTokens(payload)

    await this.updateRefreshToken(payload.sub, refreshToken)

    return {
      accessToken,
      refreshToken
    }
  }

  async logout(uuid: string) {
    this.usersService.update(uuid, { refreshToken: null })
    return {
      message: '👋 Tchau'
    }
  }

  async refreshToken(payload: UserPayload, refreshToken: string) {
    // Extrai as informações do payload, para evitar erros causados pelo "exp" que está incluso
    const { email, name, sub } = payload

    const user = await this.usersService.findByUUID(sub)
    if (!user || !user.refreshToken) throw new ForbiddenException('⛔ Access Denied')

    const refreshTokenMatches = await compare(refreshToken, user.refreshToken)
    if (!refreshTokenMatches) throw new ForbiddenException('⛔ Access Denied')

    const tokens = await this.genTokens({ email, name, sub })
    await this.updateRefreshToken(sub, tokens.refreshToken)

    return tokens
  }

  private async updateRefreshToken(uuid: string, refreshToken: string) {
    const salt = await genSalt(10)
    const hashedRefreshToken = await hash(refreshToken, salt)

    await this.usersService.update(uuid, {
      refreshToken: hashedRefreshToken
    })
  }


  private async genTokens(payload: UserPayload) {
    // Gera os 2 tipos de tokens usados para validar o usuário
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXP_S')
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH'),
        expiresIn: this.configService.get<string>('JWT_EXP_R')
      })
    ])

    return { accessToken, refreshToken }
  }
}


/*
  async reautenticar(req: Request) {
    const payload: UserPayload = this.jwtService.decode(refreshToken)
    if (payload) throw new UnauthorizedException('❌ Token Quebrado')

    const user = await this.usersService.findByUUID(payload.sub)
    if (user) throw new NotFoundException('❌ Usuário não encontrado')

    const validateToken = await this.jwtService.verify(refreshToken, {
      secret: await this.configService.get('JWT_REFRESH'),
    })
    if (validateToken) throw new UnauthorizedException('❌ Token Invalido')

    const { accessToken, newRefreshToken } = await this.genTokens(payload)

    return {
      accessToken,
      refreshToken: newRefreshToken
    }

  }
  */
