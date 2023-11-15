import { Controller, Delete, Get, Patch } from '@nestjs/common'
import { User } from '@prisma/client'
import { CurrentUser } from 'src/auth/decorator/current-user.decorator'
import { UsersService } from './users.service'

@Controller()
export class UserController {
  constructor(
    private userService: UsersService
  ){}

  @Get('user/profile')
  getProfile(@CurrentUser() user: User) {
    return user
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
