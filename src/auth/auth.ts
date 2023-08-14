import { NullableType } from 'src/utils/types/nullable.type';
import { AuthEmailLoginDto } from './dtos/auth-email-login.dto';
import { AuthRegisterDto } from './dtos/auth-register.dto';
import { LoginResponseType } from './types/login-response.type';
import { User } from 'src/users/entities/user.entity';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';

export interface IAuthService {
  validateLogin(loginDto: AuthEmailLoginDto): Promise<LoginResponseType>;
  registerUser(registerDto: AuthRegisterDto): Promise<void>;
  status(userJwtPayload: JwtPayloadType): Promise<NullableType<User>>;
  confirmEmail(hash: string): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(hash: string, password: string): Promise<void>;
}
