import { Module } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import { AuthGoogleController } from './auth-google.controller';
import { AuthModule } from 'src/auth/auth.module';

import { ConfigModule } from '@nestjs/config';
import { Services } from 'src/utils/constants';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [AuthModule, ConfigModule, PassportModule],
  providers: [
    JwtStrategy,
    GoogleStrategy,
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
