import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../user.interface';

export class CreateUserResponseDto {
  @ApiProperty({ example: 'uuid-123', description: 'ID пользователя' })
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  email: string;

  @ApiProperty({
    example: UserRole.USER,
    enum: UserRole,
    description: 'Роль пользователя',
  })
  role: UserRole;
}
