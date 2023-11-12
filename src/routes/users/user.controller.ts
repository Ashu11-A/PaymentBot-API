import { Controller, Delete, Get, Patch, Req } from '@nestjs/common'
import { UsersService } from './users.service'
import { User } from '@prisma/client'
import { Public } from '../auth/pass.decorator'

@Controller('user')
export class UserController {
  constructor(
    private userService: UsersService
  ){}

  @Public(false)
  @Get('profile')
  getProfile(@Req() req: { user: User }) {
    return req.user
  }

  @Get(':id')
  async find () {}

  @Public(false)
  @Get()
  async findAll () {
    return this.userService.findAll()
  }

  @Patch()
  async update () {}

  @Delete()
  async delete () {}
}
