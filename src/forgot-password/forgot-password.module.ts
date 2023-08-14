import { Module } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForgotPassword } from './entities/forgot-password.entity';
import { Services } from 'src/utils/constants';

@Module({
  imports: [TypeOrmModule.forFeature([ForgotPassword])],
  providers: [
    {
      provide: Services.FORGOT_PASSWORD,
      useClass: ForgotPasswordService,
    },
  ],
  exports: [
    {
      provide: Services.FORGOT_PASSWORD,
      useClass: ForgotPasswordService,
    },
  ],
})
export class ForgotPasswordModule {}
