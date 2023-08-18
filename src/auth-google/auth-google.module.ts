import { Module } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import { AuthGoogleController } from './auth-google.controller';
import { AuthModule } from 'src/auth/auth.module';

import { ConfigModule } from '@nestjs/config';
import { Services } from 'src/utils/constants';

@Module({
  imports: [AuthModule, ConfigModule],
  providers: [
    {
      provide: Services.AUTH_GOOGLE,
      useClass: AuthGoogleService,
    },
  ],
  exports: [
    {
      provide: Services.AUTH_GOOGLE,
      useClass: AuthGoogleService,
    },
  ],
  controllers: [AuthGoogleController],
})
export class AuthGoogleModule {}
