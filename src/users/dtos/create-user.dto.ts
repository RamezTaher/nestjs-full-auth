import { Transform } from 'class-transformer';

import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';

import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';

import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { UserStatus } from '../entities/user.entity';
import { AuthProvidersEnum } from 'src/auth/enums/auth-providers.enum';

export class CreateUserDto {
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  email: string | null;

  @MinLength(6)
  password?: string;

  @IsNotEmpty()
  firstName: string | null;

  @IsNotEmpty()
  lastName: string | null;

  provider?: AuthProvidersEnum;
  status?: UserStatus;

  hash?: string | null;
}
