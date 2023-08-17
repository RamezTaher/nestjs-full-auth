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
      clientID: configService.get<string>('google.clientID', {
        infer: true,
      }),
      clientSecret: configService.get<string>('google.clientID', {
        infer: true,
      }),
      callbackURL: configService.get<string>('google.callbackURL', {
        infer: true,
      }),
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    const user = await this.authService.validateSocialLogin(
      AuthProvidersEnum.google,
      {
        email: profile.emails[0].value,
        firstName: profile.name.familyName,
        lastName: profile.name.givenName,
      },
    );
    console.log('Validate');
    console.log(user);
    return user || null;
  }
}
