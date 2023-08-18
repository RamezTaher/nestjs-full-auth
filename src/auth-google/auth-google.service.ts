import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { AllConfigType } from 'src/config/config.type';
import { AuthGoogleLoginDto } from './dtos/auth-google-login.dto';
import { SocialType } from 'src/social/types/social.type';
import { IAuthGoogleService } from './auth-google';

@Injectable()
export class AuthGoogleService implements IAuthGoogleService {
  private google: OAuth2Client;

  constructor(private configService: ConfigService<AllConfigType>) {
    this.google = new OAuth2Client(
      configService.get<string>('google.clientId', { infer: true }),
      configService.get<string>('google.clientSecret', { infer: true }),
    );
  }

  async getProfileByToken(loginDto: AuthGoogleLoginDto): Promise<SocialType> {
    const ticket = await this.google.verifyIdToken({
      idToken: loginDto.idToken,
      audience: [
        this.configService.getOrThrow<string>('google.clientId', {
          infer: true,
        }),
      ],
    });

    const data = ticket.getPayload();

    if (!data) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: 'wrongToken',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return {
      id: data.sub,
      email: data.email,
      firstName: data.given_name,
      lastName: data.family_name,
    };
  }
}
