import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from '../users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { LoginValidationMiddleware } from './middlewares/login-validation.middleware'
import { JwtAccessTokenStrategy } from './strategies/acessToken.strategy'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtRefreshTokenStrategy } from './strategies/refreshToken.strategy'

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    JwtModule.register({ global: true })
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginValidationMiddleware).forRoutes('/auth/login')
  }
}
