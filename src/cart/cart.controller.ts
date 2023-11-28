import { Controller, Get, Post } from '@nestjs/common'
import { IsPublic } from 'src/auth/decorator/pass.decorator'

@IsPublic()
@Controller()
export class CartController {
  constructor(){}
}
