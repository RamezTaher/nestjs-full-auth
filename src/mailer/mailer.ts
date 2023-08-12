import nodemailer from 'nodemailer';

export interface IMailerService {
  sendMail({
    templatePath,
    context,
    ...mailOptions
  }: nodemailer.SendMailOptions & {
    templatePath: string;
    context: Record<string, unknown>;
  }): Promise<void>;
}
