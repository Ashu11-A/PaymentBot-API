import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { ThrottlerModule } from '@nestjs/throttler'
import { UsersModule } from './users/users.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    AuthModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20
      }
    ]),
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.dev', '.env']
    })
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
