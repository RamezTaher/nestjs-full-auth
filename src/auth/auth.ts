import { AuthEmailLoginDto } from './dtos/auth-email-login.dto';
import { AuthRegisterDto } from './dtos/auth-register.dto';
import { LoginResponseType } from './types/login-response.type';

export interface IAuthService {
  validateLogin(loginDto: AuthEmailLoginDto): Promise<LoginResponseType>;
  registerUser(registerDto: AuthRegisterDto): Promise<void>;
}
