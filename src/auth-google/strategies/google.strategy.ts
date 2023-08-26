import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { Services } from 'src/utils/constants';
import { IAuthService } from 'src/auth/auth';
import { AuthProvidersEnum } from 'src/auth/enums/auth-providers.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Services.AUTH) private readonly authService: IAuthService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {
    super({
      clientID: configService.get<string>('google.clientId', {
        infer: true,
      }),
      clientSecret: configService.get<string>('google.clientSecret', {
        infer: true,
      }),
      callbackURL: configService.get<string>('google.callbackURL', {
        infer: true,
      }),
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const socialData = {
      id: profile.id,
      email: profile.emails ? profile.emails[0].value : null,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
    };

    // Assuming you have a method to handle social login validation
    const loginResponse = await this.authService.validateSocialLogin(
      AuthProvidersEnum.google,
      socialData,
    );

    return loginResponse;
  }
}
