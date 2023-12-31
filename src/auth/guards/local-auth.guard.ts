import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  handleRequest(err, user) {
    console.log('local-auth.guard.ts: ', err, user)
    if (err || !user) {
      console.log('local-auth.guard.ts: ' + err)
      throw new UnauthorizedException(err?.message)
    }

    return user
  }
}
