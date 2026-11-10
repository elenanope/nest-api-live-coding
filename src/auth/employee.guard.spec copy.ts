import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { EmployeeGuard } from './employee.guard';

// Un "contexto" falso: una petición que ya trae el id del usuario
const context = {
  switchToHttp: () => ({ getRequest: () => ({ userId: 1 }) }),
} as unknown as ExecutionContext;

describe('EmployeeGuard', () => {
  // Un UsersService FALSO: findById responde lo que nosotros digamos
  const fakeUsersService = { findById: jest.fn() };
  const guard = new EmployeeGuard(fakeUsersService as unknown as UsersService);
  
  it('deja pasar a un empleado', async () => {
    fakeUsersService.findById.mockResolvedValue({ id: 1, role: 'employee' });

    await expect(guard.canActivate(context)).resolves.toBe(true); // resolves: la promesa sale bien
  });

  it('no deja pasar a un cliente (403)', async () => {
    fakeUsersService.findById.mockResolvedValue({ id: 1, role: 'customer' });

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException); // rejects: la promesa falla
  });
});