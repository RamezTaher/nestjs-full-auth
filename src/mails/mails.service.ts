import { Injectable, Inject } from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { IMailerService } from 'src/mailer/mailer';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { IMailsService } from './mails';
import { MailData } from './types/mails.type';
import path from 'path';

@Injectable()
export class MailsService implements IMailsService {
  constructor(
    @Inject(Services.MAILER) private readonly mailerService: IMailerService,

    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async confirmRegisterUser(
    mailData: MailData<{ hash: string; user: string }>,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: 'Email Confirmation',
      text: `${this.configService.get('app.frontendDomain', {
        infer: true,
      })}/confirm-email/${mailData.data.hash}`,
      templatePath: path.join(
        this.configService.getOrThrow('app.workingDirectory', {
          infer: true,
        }),
        'src',
        'mails',
        'templates',
        'confirm.hbs',
      ),
      context: {
        username: mailData.data.user,
        confirmationLink: `${this.configService.get<string>(
          'app.frontendDomain',
          {
            infer: true,
          },
        )}/confirm-email/${mailData.data.hash}`,
      },
    });
  }

  async forgotPassword(
    mailData: MailData<{ hash: string; user: string }>,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: 'Password Reset',
      text: `${this.configService.get<string>('app.frontendDomain', {
        infer: true,
      })}/password-change/${mailData.data.hash}`,
      templatePath: path.join(
        this.configService.getOrThrow<string>('app.workingDirectory', {
          infer: true,
        }),
        'src',
        'mails',
        'templates',
        'reset-password.hbs',
      ),
      context: {
        username: mailData.data.user,
        resetLink: `${this.configService.get<string>('app.frontendDomain', {
          infer: true,
        })}/password-change/${mailData.data.hash}`,
      },
    });
  }
}
