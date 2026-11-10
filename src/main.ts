import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './app.config';

process.loadEnvFile();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app); // prefijo, validación y CORS
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
