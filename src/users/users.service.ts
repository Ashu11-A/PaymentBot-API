import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { genSalt, hashSync } from 'bcrypt'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService
  ) { }

  async create(createUserDto: CreateUserDto) {
    const emailExist = await this.findByEmail(createUserDto.email)
    const usernameExist = await this.findByUsername(createUserDto.username)
    if (emailExist || usernameExist) throw new HttpException('❌ Usuário já existe!', HttpStatus.CONFLICT)

    const salt = await genSalt(10)

    const data: Prisma.UserCreateInput = {
      ...createUserDto,
      permission: {
        connect: { name: 'user' },
        create: {
          name: 'user',
          level: 0
        }
      },
      password: hashSync(createUserDto.password, salt)
    }

    const createUser = await this.prisma.user.create({ data })
    return {
      ...createUser,
      password: undefined
    }
  }

  /* Find Users */

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.prisma.user.findFirst({
      where: { email }
    })
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return await this.prisma.user.findFirst({
      where: { username }
    })
  }

  async findByUUID(uuid: string): Promise<User | undefined> {
    return await this.prisma.user.findFirst({
      where: { uuid }
    })
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        email: true,
        name: true,
        created_at: true,
        updated_at: true
      }
    })
  }
}
