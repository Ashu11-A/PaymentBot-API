import { HttpException, HttpStatus } from '@nestjs/common'

export class LoginException extends HttpException {
  constructor() {
    super('❌ Email ou Senha invalidos!', HttpStatus.NOT_FOUND)
  }
}
