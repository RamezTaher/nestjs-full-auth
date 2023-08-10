import { registerAs } from '@nestjs/config';
import { MailerConfig } from './config.type';
import {
  IsString,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsBoolean,
  IsEmail,
} from 'class-validator';
import validateConfig from 'src/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  MAILER_PORT: number;

  @IsString()
  MAILER_HOST: string;

  @IsString()
  @IsOptional()
  MAILER_USER: string;

  @IsString()
  @IsOptional()
  MAILER_PASSWORD: string;

  @IsEmail()
  MAILER_DEFAULT_EMAIL: string;

  @IsString()
  MAILER_DEFAULT_NAME: string;

  @IsBoolean()
  MAILER_IGNORE_TLS: boolean;

  @IsBoolean()
  MAILER_SECURE: boolean;

  @IsBoolean()
  MAILER_REQUIRE_TLS: boolean;
}

export default registerAs<MailerConfig>('mailer', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    port: process.env.MAILER_PORT ? parseInt(process.env.MAILER_PORT, 10) : 587,
    host: process.env.MAILER_HOST,
    user: process.env.MAILER_USER,
    password: process.env.MAILER_PASSWORD,
    defaultEmail: process.env.MAILER_DEFAULT_EMAIL,
    defaultName: process.env.MAILER_DEFAULT_NAME,
    ignoreTLS: process.env.MAILER_IGNORE_TLS === 'true',
    secure: process.env.MAILER_SECURE === 'true',
    requireTLS: process.env.MAILER_REQUIRE_TLS === 'true',
  };
});
