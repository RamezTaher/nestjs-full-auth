import { Controller, Get, UseGuards, Request, Inject } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { GoogleAuthGuard } from './guards/google.guard';
import { AuthGuard } from '@nestjs/passport';
import { NullableType } from 'src/utils/types/nullable.type';
import { User } from 'src/users/entities/user.entity';
import { IAuthService } from 'src/auth/auth';

@Controller(Routes.AUTH)
export class AuthGoogleController {
  constructor(@Inject(Services.AUTH) private authService: IAuthService) {}

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return { msg: 'Google Authentication' };
  }

  // api/auth/google/redirect
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handleRedirect() {
    return { msg: 'OK' };
  }

  @Get('status')
  @UseGuards(AuthGuard('jwt'))
  public status(@Request() request): Promise<NullableType<User>> {
    return this.authService.status(request.user);
  }
}
