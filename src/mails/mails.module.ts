import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { Services } from 'src/utils/constants';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [ConfigModule, MailerModule],
  providers: [
    {
      provide: Services.MAILS,
      useClass: MailsService,
    },
  ],
  exports: [
    {
      provide: Services.MAILS,
      useClass: MailsService,
    },
  ],
})
export class MailsModule {}
