import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Services } from 'src/utils/constants';
import { UsersModule } from 'src/users/users.module';
import { SessionModule } from 'src/session/session.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { MailsModule } from 'src/mails/mails.module';
import { ForgotPasswordModule } from 'src/forgot-password/forgot-password.module';

@Module({
  imports: [
    UsersModule,
    SessionModule,
    MailsModule,
    PassportModule,
    ForgotPasswordModule,
    JwtModule.register({}),
  ],

  controllers: [AuthController],
  providers: [
    JwtRefreshStrategy,
    JwtStrategy,
    AnonymousStrategy,
    {
      provide: Services.AUTH,
      useClass: AuthService,
    },
  ],
  exports: [
    {
      provide: Services.AUTH,
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
