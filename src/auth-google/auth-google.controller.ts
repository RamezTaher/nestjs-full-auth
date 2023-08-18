import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Inject,
} from '@nestjs/common';

import { LoginResponseType } from '../auth/types/login-response.type';
import { Routes, Services } from 'src/utils/constants';
import { IAuthService } from 'src/auth/auth';
import { IAuthGoogleService } from './auth-google';
import { AuthGoogleLoginDto } from './dtos/auth-google-login.dto';
import { AuthProvidersEnum } from 'src/auth/enums/auth-providers.enum';

@Controller(Routes.AUTH_GOOGLE)
export class AuthGoogleController {
  constructor(
    @Inject(Services.AUTH) private readonly authService: IAuthService,
    @Inject(Services.AUTH_GOOGLE)
    private readonly authGoogleService: IAuthGoogleService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: AuthGoogleLoginDto,
  ): Promise<LoginResponseType> {
    const socialData = await this.authGoogleService.getProfileByToken(loginDto);

    return this.authService.validateSocialLogin(
      AuthProvidersEnum.google,
      socialData,
    );
  }
}
