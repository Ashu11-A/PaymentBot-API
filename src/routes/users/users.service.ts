import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from 'src/database/prismaService'

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService
  ){}

  async create(options: {
    name: string,
    email: string,
    password: string,
    idPermission: number
  }) {
    const { name, email, password, idPermission } = options

    return await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        idPermission
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
