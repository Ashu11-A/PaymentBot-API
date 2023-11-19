import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserFromJwt } from '../models/UserFromJwt'
import { UserPayload } from '../models/UserPayload'

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET
    })
  }

  async validate(payload: UserPayload): Promise<UserFromJwt> {
    console.log('acessToken.strategy.ts: ', payload)
    return {
      uuid: payload.sub,
      email: payload.email,
      name: payload.name,
    }
  }
}
