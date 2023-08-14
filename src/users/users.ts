import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { NullableType } from 'src/utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { DeepPartial } from 'typeorm';

export interface IUsersService {
  createUser(createUserDto: CreateUserDto): Promise<User>;
  findOneUser(options: EntityCondition<User>): Promise<NullableType<User>>;
  findUsersWithPagination(
    paginationOptions: IPaginationOptions,
  ): Promise<User[]>;
  updateUser(id: User['id'], payload: DeepPartial<User>): Promise<User>;
  deleteUser(id: User['id']): Promise<void>;
  saveUser(user: User): Promise<User>;
}
