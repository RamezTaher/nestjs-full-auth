import { Transform } from 'class-transformer';

import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { UserStatus } from '../entities/user.entity';
import { AuthProvidersEnum } from 'src/auth/enums/auth-providers.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'ramez@gmail.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string | null;

  @ApiProperty({ example: '123456' })
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: 'Ramez' })
  @IsNotEmpty()
  firstName: string | null;

  @ApiProperty({ example: 'Ben Taher' })
  @IsNotEmpty()
  lastName: string | null;

  provider?: AuthProvidersEnum;
  status?: UserStatus;
  socialId?: string | null;

  hash?: string | null;
}
