import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth/auth.controller';
import { AUTH_SERVICE, RABBITMQ_URL, USER_SERVICE } from './common/constants';
import * as dotenv from 'dotenv';
import { UserController } from './users/users.controller';

dotenv.config();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [String(RABBITMQ_URL)],
          queue: 'auth_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: USER_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [String(RABBITMQ_URL)],
          queue: 'users_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [AuthController, UserController],
})
export class AppModule {}
