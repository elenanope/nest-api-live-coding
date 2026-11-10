import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './app.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

process.loadEnvFile();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app); // prefijo, validación y CORS

  // Documentación en http://localhost:3000/docs
  const config = new DocumentBuilder()
    .setTitle('API de libros') // título de la página
    .setDescription('Libros, registro y login')
    .setVersion('1.0')
    .addBearerAuth() // la API usa tokens "Bearer"
    .build();
  const document = SwaggerModule.createDocument(app, config); // lee controladores y DTO
  SwaggerModule.setup('docs', app, document); // publica la página en /docs

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
