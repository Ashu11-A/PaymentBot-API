import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common'
import { UsersService } from './users.service'
import { User } from '@prisma/client'
import { CreateUserDto } from './dto/create-user.dto'
import { CurrentUser } from 'src/auth/decorator/current-user.decorator'

@Controller()
export class UserController {
  constructor(
    private userService: UsersService
  ){}

  @Get('user/profile')
  getProfile(@CurrentUser() user: User) {
    return user
  }

  @Post('user/create')
  async create (@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Patch('user/update')
  async update () {}

  @Delete('user/delete')
  async delete () {}


  @Get('users/:id')
  async find () {}

  @Get('users')
  async findAll () {
    return this.userService.findAll()
  }
}
