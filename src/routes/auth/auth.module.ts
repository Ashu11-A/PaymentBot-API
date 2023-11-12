import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from '../users/users.module'
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'
import { APP_GUARD } from '@nestjs/core'
import { JwtGuard } from './guards/jwt.guard'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => ({
        global: false,
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXP_S') }
      })
    })
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard
    }
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

