import { Controller, Delete, Get, Patch, Req } from '@nestjs/common'
import { UsersService } from './users.service'
import { User } from '@prisma/client'
import { Public } from '../auth/pass.decorator'

@Public(false)
@Controller()
export class UserController {
  constructor(
    private userService: UsersService
  ){}

  @Get('user/profile')
  getProfile(@Req() req: { user: User }) {
    return req.user
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
