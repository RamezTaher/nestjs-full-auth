import { Controller, Inject, Get, UseGuards, Req } from '@nestjs/common';

import { Routes, Services } from 'src/utils/constants';
import { IAuthService } from 'src/auth/auth';
import { AuthProvidersEnum } from 'src/auth/enums/auth-providers.enum';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller(Routes.AUTH)
export class AuthGoogleController {
  constructor(
    @Inject(Services.AUTH) private readonly authService: IAuthService,
  ) {}

  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // Initiates the Google OAuth2 authentication process
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req: any) {
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
