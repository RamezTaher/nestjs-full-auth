import { IsNotEmpty } from 'class-validator';

export class AuthConfirmEmailDto {
  @IsNotEmpty()
  hash: string;
}
