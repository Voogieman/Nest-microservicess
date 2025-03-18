import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.interface';

@Controller()
export class UsersController {
  @MessagePattern({ cmd: 'create-user' })
  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password' | 'refreshToken'>> {
    // Симулируем "создание" пользователя
    const user: User = {
      id: uuidv4(),
      email: createUserDto.email,
      role: 'USER',
      password: 'hidden',
      refreshToken: null,
    };

    const { password, refreshToken, ...safeUser } = user;
    return safeUser;
  }
}
