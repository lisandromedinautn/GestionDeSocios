import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);



  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: 'http://localhost:4200', // Permite solo tu frontend de Angular
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  // Esto te confirmará en consola que todo levantó bien
  Logger.log(
    `🚀 Aplicación corriendo en: http://localhost:${port}`,
    'Bootstrap',
  );
}
bootstrap();
