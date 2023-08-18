import { IsNotEmpty } from 'class-validator';

export class AuthGoogleLoginDto {
  @IsNotEmpty()
  idToken: string;
}
