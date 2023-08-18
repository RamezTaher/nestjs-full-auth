import { Module } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import { AuthGoogleController } from './auth-google.controller';
import { AuthModule } from 'src/auth/auth.module';
import { GoogleStrategy } from './strategies/google.strategy';

import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [AuthGoogleService, GoogleStrategy],
  controllers: [AuthGoogleController],
})
export class AuthGoogleModule {}
