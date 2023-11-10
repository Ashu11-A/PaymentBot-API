import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { jwtConstants } from '../constants'
import { SetMetadata } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UsersService } from '../../users/users.service'

export const IS_PUBLIC_KEY = 'isPublic'
export const SkipAuth = () => SetMetadata(IS_PUBLIC_KEY, true)

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private usersService: UsersService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (isPublic) return true

    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) throw new UnauthorizedException()

    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: jwtConstants.secret })

      const { uuid } = payload
      if (!uuid) throw new UnauthorizedException()

      const user = await this.usersService.findOne({ uuid })
      if (!user) throw new NotFoundException
      request['user'] = user
    } catch {
      throw new UnauthorizedException()
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
