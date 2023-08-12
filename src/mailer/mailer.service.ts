import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import { AllConfigType } from 'src/config/config.type';
import Handlebars from 'handlebars';
import fs from 'node:fs/promises';
import { IMailerService } from './mailer';

@Injectable()
export class MailerService implements IMailerService {
  private readonly transporter: nodemailer.Transporter;
  constructor(private readonly configService: ConfigService<AllConfigType>) {
    this.transporter = nodemailer.createTransport({
      host: configService.get<string>('mailer.host', { infer: true }),
      port: configService.get<number>('mailer.port', { infer: true }),
      ignoreTLS: configService.get<boolean>('mailer.ignoreTLS', {
        infer: true,
      }),
      secure: configService.get<boolean>('mailer.secure', { infer: true }),
      requireTLS: configService.get<boolean>('mailer.requireTLS', {
        infer: true,
      }),
      auth: {
        user: configService.get<string>('mailer.user', { infer: true }),
        pass: configService.get<string>('mailer.password', { infer: true }),
      },

      debug: true,
    });
  }

  async sendMail({
    templatePath,
    context,
    ...mailOptions
  }: nodemailer.SendMailOptions & {
    templatePath: string;
    context: Record<string, unknown>;
  }): Promise<void> {
    let html: string | undefined;
    if (templatePath) {
      const template = await fs.readFile(templatePath, 'utf-8');
      html = Handlebars.compile(template, {
        strict: true,
      })(context);
    }

    await this.transporter.sendMail({
      ...mailOptions,
      from: mailOptions.from
        ? mailOptions.from
        : `"${this.configService.get<string>('mailer.defaultName', {
            infer: true,
          })}" <${this.configService.get<string>('mailer.defaultEmail', {
            infer: true,
          })}>`,
      html: mailOptions.html ? mailOptions.html : html,
    });
  }
}
