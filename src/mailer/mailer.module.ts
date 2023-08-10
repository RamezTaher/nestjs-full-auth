import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { Services } from 'src/utils/constants';

@Module({
  providers: [
    {
      provide: Services.MAILER,
      useClass: MailerService,
    },
  ],
  exports: [
    {
      provide: Services.MAILER,
      useClass: MailerService,
    },
  ],
})
export class MailerModule {}
