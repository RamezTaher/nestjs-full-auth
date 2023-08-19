import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthGoogleLoginDto {
  @ApiProperty({ example: '12asa262sa5sa' })
  @IsNotEmpty()
  idToken: string;
}
