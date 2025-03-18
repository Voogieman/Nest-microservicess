import {
  Body,
  ConflictException,
  Controller,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { USER_SERVICE } from '../common/constants';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { User } from './user.interface';

@Controller('users')
export class UserController {
  constructor(@Inject(USER_SERVICE) private readonly userClient: ClientProxy) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
    type: CreateUserResponseDto, // Мы не можем напрямую указать интерфейс в Swagger
  })
  @ApiResponse({ status: 409, description: 'Email уже зарегистрирован' })
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password' | 'refreshToken'>> {
    try {
      return await firstValueFrom(
        this.userClient.send<
          Omit<User, 'password' | 'refreshToken'>,
          CreateUserDto
        >({ cmd: 'create-user' }, createUserDto),
      );
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message === 'Email already exists') {
        throw new ConflictException('Email уже зарегистрирован');
      }
      throw error;
    }
  }
}
