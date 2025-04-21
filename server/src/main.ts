import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  app.use(cors());
  app.use(cookieParser());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use('/uploads', express.static('public/uploads'));

  app.setGlobalPrefix('v1');
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true,
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     exceptionFactory: (errors: ValidationError[]) => {
  //       const formattedErrors = errors.map((error) => ({
  //         property: error.property,
  //         constraints: error.constraints,
  //         children: error.children.length > 0 ? error.children : undefined,
  //       }));
  //       return new BadRequestException({
  //         message: 'Validation failed',
  //         errors: formattedErrors,
  //       });
  //     },
  //   }),
  // );

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port as number, () => {
    console.log(`Server is running on port ${port}`);
  });
}

bootstrap();
