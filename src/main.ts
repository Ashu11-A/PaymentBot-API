import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import * as cookieParser from 'cookie-parser'

async function bootstrap () {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))
  app.enableCors({
    origin: true,
    methods: 'GET, PUT, DELETE, POST, PATCH',
    credentials: true
  })
  app.use(cookieParser())
  app.use(helmet())

  const config = new DocumentBuilder()
    .setTitle('PaymentBot API')
    .setDescription('Essa é a documentação de rotas desse projeto')
    .setVersion('0.1 - Beta')
    .addTag('payment')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  await app.listen(3000)
}
bootstrap()
