import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Pool } from 'pg';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.config';

describe('API de libros', () => {
  let app: INestApplication;

  // Antes de todos los tests: arrancamos la aplicación entera
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule], // toda la app: libros, usuarios, auth...
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app); // la misma configuración que main.ts
    await app.init();
  });

  // Después de todos: cerramos la conexión con PostgreSQL y la aplicación
  afterAll(async () => {
    await app.get(Pool).end();
    await app.close();
  });

  it('GET /api/books responde 200 con una lista', async () => {
    const response = await request(app.getHttpServer()).get('/api/books'); // la petición

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /api/books/999999 responde 404', async () => {
    const response = await request(app.getHttpServer()).get('/api/books/999999');

    expect(response.status).toBe(404);
  });

  it('POST /api/books sin token responde 401', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/books')
      .send({ title: 'Momo', author: 'Michael Ende', pages: 256 }); // el body

    expect(response.status).toBe(401);
  });

  it('GET /api/books/abc responde 400', async () => {
    const response = await request(app.getHttpServer()).get('/api/books/abc');

    expect(response.status).toBe(400);
  });

  it('POST /api/auth/login con una contraseña mal responde 401', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'ana@mail.com', password: 'wrongpassword' });

    expect(response.status).toBe(401);
  });
});