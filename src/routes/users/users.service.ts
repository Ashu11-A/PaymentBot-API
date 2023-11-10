import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from 'src/database/prismaService'
import { CreateUserDto } from '../auth/dto/create-user.dto'
import { genSalt, hash } from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService
  ){}

  async create(data: CreateUserDto) {
    const { email, name, password } = data
    const userExist = await this.findOne({ email })
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

    return await this.prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        idPermission: permissions.id
      }
    })
  }

  async findOne(options: {
    uuid?: string
    email?: string
  }
  ): Promise<User | undefined> {
    const { uuid, email } = options

    return await this.prisma.user.findUnique({
      where: { uuid, email }
    })
  }
}
