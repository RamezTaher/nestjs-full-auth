import { DeepPartial } from 'typeorm';
import { ForgotPassword } from './entities/forgot-password.entity';
import { FindOptions } from 'src/utils/types/find-options.type';
import { NullableType } from 'src/utils/types/nullable.type';

export interface IForgotPasswordService {
  create(data: DeepPartial<ForgotPassword>): Promise<ForgotPassword>;
  softDelete(id: ForgotPassword['id']): Promise<void>;
  findOne(
    options: FindOptions<ForgotPassword>,
  ): Promise<NullableType<ForgotPassword>>;
}
