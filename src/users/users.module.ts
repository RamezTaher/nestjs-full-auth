import { Module } from '@nestjs/common';
import { Service } from './.service';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  providers: [Service, UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
