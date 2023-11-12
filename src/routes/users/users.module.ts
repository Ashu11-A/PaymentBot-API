import { Module } from '@nestjs/common'
import { PrismaService } from 'src/database/prismaService'
import { UsersService } from './users.service'
import { UserController } from './user.controller'

@Module({
  controllers: [UserController],
  providers: [
    UsersService,
    PrismaService,
  ],
  exports: [UsersService]
})
export class UsersModule {}
