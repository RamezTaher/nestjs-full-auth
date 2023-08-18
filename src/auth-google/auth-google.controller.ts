import { Controller, Get, UseGuards, Request, Inject } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { GoogleAuthGuard } from './guards/google.guard';

import { IAuthService } from 'src/auth/auth';
import { AuthProvidersEnum } from 'src/auth/enums/auth-providers.enum';

@Controller(Routes.AUTH)
export class AuthGoogleController {
  constructor(@Inject(Services.AUTH) private authService: IAuthService) {}

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return { msg: 'Google Authentication' };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async handleRedirect(@Request() req) {
    const user = await this.authService.validateSocialLogin(
      AuthProvidersEnum.google,
      {
        id: req.user.user.id,
        firstName: req.user.user.firstName,
        lastName: req.user.user.lastName,
        email: req.user.user.email,
      },
    );

    return user;
  }
}
