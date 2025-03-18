import {
  Body,
  Controller,
  Inject,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AUTH_SERVICE } from '../common/constants';
import { LoginDto } from './dto/login.dto';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  @Post('login')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Успешный вход',
    type: AuthTokensDto,
  })
  @ApiResponse({ status: 401, description: 'Неверный email или пароль' })
  async login(@Body() loginDto: LoginDto): Promise<AuthTokensDto> {
    try {
      return await firstValueFrom(
        this.authClient.send<AuthTokensDto, LoginDto>(
          { cmd: 'login' },
          loginDto,
        ),
      );
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message === 'Invalid credentials') {
        throw new UnauthorizedException('Неверный email или пароль');
      }
      throw error; // Остальное прокинуть наверх
    }
  }
}
