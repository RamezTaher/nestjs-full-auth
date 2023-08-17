import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google.guard';
import { Request } from 'express';
import { Routes } from 'src/utils/constants';

@Controller(Routes.AUTH)
export class AuthGoogleController {
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
  user(@Req() request: Request) {
    console.log(request.user);
    if (request.user) {
      return { msg: 'Authenticated' };
    } else {
      return { msg: 'Not Authenticated' };
    }
  }
}
