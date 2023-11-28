import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerModule } from '@nestjs/throttler'
import { AuthModule } from './auth/auth.module'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'
import { PrismaModule } from './prisma/prisma.module'
import { UsersModule } from './users/users.module'
import { CartService } from './cart/cart.service'
import { CartModule } from './cart/cart.module'
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    PrismaModule,
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
    }),
    CartModule,
    ProductModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    CartService
  ]
})
export class AppModule {}
