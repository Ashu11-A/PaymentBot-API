import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateUser } from './dto/update-user.dto'
@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService
  ) {}

  async create(data: Prisma.UserCreateInput) {
    console.log(data)
    const createUser = await this.prisma.user.create({ data })
    return {
      ...createUser,
      password: undefined
    }
  }

  async update(uuid: string, updateUserDto: UpdateUser): Promise<User> {
    const updateUserData = this.prisma.user.update({
      where: { uuid },
      data: { ...updateUserDto }
    })
    return {
      ...updateUserData,
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
