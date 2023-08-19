import { MailData } from './types/mails.type';

export interface IMailsService {
  confirmRegisterUser(
    mailData: MailData<{ hash: string; user: string }>,
  ): Promise<void>;

  forgotPassword(
    mailData: MailData<{ hash: string; user: string }>,
  ): Promise<void>;
}
