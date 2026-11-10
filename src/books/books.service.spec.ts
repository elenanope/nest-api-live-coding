import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { BooksService } from './books.service';

describe('BooksService', () => {
  // Un Pool FALSO: tiene un método query, pero no habla con PostgreSQL
  const fakePool = { query: jest.fn() };

  // El servicio DE VERDAD, con el Pool falso
  const service = new BooksService(fakePool as unknown as Pool);

  beforeEach(() => {
    fakePool.query.mockReset(); // antes de cada test, el falso empieza de cero
  });

  it('findOne lanza un 404 si no hay ninguna fila', async () => {
    // Preparar: la "base de datos" no devuelve filas
    fakePool.query.mockResolvedValue({ rows: [] });

    // Ejecutar y comprobar: tiene que fallar con NotFoundException
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('findOne devuelve un libro si lo encuentra', async () => {
    // Preparar: la "base de datos" devuelve una fila
    fakePool.query.mockResolvedValue({ rows: [{ id: 1, title: 'Momo', author: 'Michael Ende', pages: 256, created_at: new Date('2026-01-01') }] });

    const book = await service.findOne(1);

    // Ejecutar y comprobar: tiene que devolver el libro
    expect(book).toEqual({
      id: 1,
      title: 'Momo',
      author: 'Michael Ende',
      pages: 256,
      createdAt: new Date('2026-01-01'),
    });

    expect(book.title).toBe('Momo');
    expect(book.createdAt).toEqual(new Date('2026-01-01'));
  });


  it('update sin campos lanza un 400 y NO toca la base de datos', async () => {
    await expect(service.update(1, {})).rejects.toThrow(BadRequestException);

    expect(fakePool.query).not.toHaveBeenCalled(); // ni una sola consulta
  });


  it('remove de un libro que no existe lanza un error', async () => {
    // Preparar: la "base de datos" no devuelve filas
    fakePool.query.mockResolvedValue({ rows: [] });

    await expect(service.remove(5)).rejects.toThrow(NotFoundException);

    expect(fakePool.query).toHaveBeenCalled(); // ni una sola consulta
  });
});