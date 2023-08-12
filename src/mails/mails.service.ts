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
    mailData: MailData<{ hash: string }>,
  ): Promise<void> {
    const emailConfirmTitle = 'Confirm email';
    const text1 = 'Hello Sir,';
    const text2 = 'You’re almost done creating your account';
    const text3 =
      'Simply click the big green button below to verify your email address.';
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: emailConfirmTitle,
      text: `${this.configService.get('app.frontendDomain', {
        infer: true,
      })}/confirm-email/${mailData.data.hash} ${emailConfirmTitle}`,
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
        title: emailConfirmTitle,
        url: `${this.configService.get<string>('app.frontendDomain', {
          infer: true,
        })}/confirm-email/${mailData.data.hash}`,
        actionTitle: emailConfirmTitle,
        app_name: this.configService.get<string>('app.name', { infer: true }),
        text1,
        text2,
        text3,
      },
    });
  }

  async forgotPassword(mailData: MailData<{ hash: string }>): Promise<void> {
    const resetPasswordTitle = 'Reset your password';
    const text1 = 'Trouble signing in?';
    const text2 = 'Resetting your password is easy.';
    const text3 =
      'Just press the button below and follow the instructions. We’ll have you up and running in no time.';
    const text4 =
      'If you did not make this request then please ignore this email.';
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: resetPasswordTitle,
      text: `${this.configService.get<string>('app.frontendDomain', {
        infer: true,
      })}/password-change/${mailData.data.hash} ${resetPasswordTitle}`,
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
        title: resetPasswordTitle,
        url: `${this.configService.get<string>('app.frontendDomain', {
          infer: true,
        })}/password-change/${mailData.data.hash}`,
        actionTitle: resetPasswordTitle,
        app_name: this.configService.get<string>('app.name', {
          infer: true,
        }),
        text1,
        text2,
        text3,
        text4,
      },
    });
  }
}
