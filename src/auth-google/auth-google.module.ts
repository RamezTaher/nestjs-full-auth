import { Module } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import { AuthGoogleController } from './auth-google.controller';

@Module({
  providers: [AuthGoogleService],
  controllers: [AuthGoogleController],
})
export class AuthGoogleModule {}
