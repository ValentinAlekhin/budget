import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import config from '@app/config'
import { AuthenticatedSocketAdapter } from '@app/socket/authenticated-socket.adapter'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  app.useWebSocketAdapter(new AuthenticatedSocketAdapter(app))

  app.enableCors({
    credentials: true,
    origin: (origin, callback) => {
      return callback(null, true)
    },
  })

  app.use(cookieParser())

  const docConfig = new DocumentBuilder()
    .setTitle('NestJS Course')
    .setDescription('The NestJS Course API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, docConfig)
  SwaggerModule.setup('docs', app, document)

  await app.listen(config.port)

  console.log(`App started on port ${config.port}`)
}

bootstrap()
