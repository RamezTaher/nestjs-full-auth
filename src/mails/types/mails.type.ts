export type MailData<T = never> = {
  to: string;
  data: T;
};
