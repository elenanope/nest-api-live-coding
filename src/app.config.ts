import { INestApplication, ValidationPipe } from '@nestjs/common';

// La configuración de la app, en un solo sitio.
// La usan main.ts y los tests, para que todos funcionen igual.
export function configureApp(app: INestApplication) {
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({ origin: 'http://localhost:5173' });
}