import { Module } from '@nestjs/common'
import { PrismaService } from 'src/database/prismaService'
import { UsersService } from './users.service'

@Module({
  controllers: [],
  providers: [UsersService, PrismaService],
  exports: [UsersService]
})
export class UsersModule {}
