import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from './auth.guard';
import type { AuthRequest } from './jwt-payload'; // "type": es solo un tipo

@Controller('auth') // rutas /api/auth/...
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') // POST /api/auth/register → 201
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login') // POST /api/auth/login
  @HttpCode(200) // un login no crea nada: 200 en vez de 201
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
  
  /*@Post('login') // POST /api/auth/login
  @HttpCode(200) // un login no crea nada: 200 en vez de 201
   async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
   const { accessToken } = await this.authService.login(dto);
   res.cookie('access_token', accessToken, {
     httpOnly: true,                                 // JS del navegador no la ve
     secure: process.env.NODE_ENV === 'production',  // solo HTTPS en producción
     sameSite: 'lax',
     maxAge: 60 * 60 * 1000,                         // 1h, igual que expiresIn del JwtModule
   });
   return { message: 'Login correcto' };             // el token ya no va en el body
 }
   */

  @Get('me') // GET /api/auth/me
  @UseGuards(AuthGuard) // antes de entrar, pasa por el portero
  me(@Req() request: AuthRequest) {
    return this.authService.me(request.userId); // el id que dejó el AuthGuard
  }
}
