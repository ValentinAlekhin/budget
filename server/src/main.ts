import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import config from '@app/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({ credentials: true,
    origin: (origin, callback) => {
      return callback(null, true)
    } })
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
}

bootstrap()
