import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { UserPayload } from '../models/UserPayload'

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH,
      passReqToCallback: true,
      ignoreExpiration: false
    })
  }

  async validate(req: Request, payload: UserPayload) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim()
    console.log('refreshToken.strategy.ts: ', refreshToken)

    return {
      ...payload,
      refreshToken
    }
  }
}
