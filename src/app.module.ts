import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './routes/auth/auth.module'
import { ThrottlerModule } from '@nestjs/throttler'
import { UsersModule } from './routes/users/users.module'

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
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
