import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from 'src/database/prismaService'
import { SignUpDto } from '../auth/dto/signUp-user.dto'
import { genSalt, hash } from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService
  ) { }

  async create(data: SignUpDto) {
    const { email, name, password } = data
    const userExist = await this.findOne({ email })
    if (userExist) throw new HttpException('❌ Usuário já existe!', HttpStatus.CONFLICT)

    const salt = await genSalt(10)
    const hashedPassword = await hash(password, salt)
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
        password: hashedPassword,
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
