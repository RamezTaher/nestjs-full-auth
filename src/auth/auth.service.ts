import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IUsersService } from 'src/users/users';
import { Services } from 'src/utils/constants';
import { AuthEmailLoginDto } from './dtos/auth-email-login.dto';
import { LoginResponseType } from './types/login-response.type';
import { AuthProvidersEnum } from './enums/auth-providers.enum';
import crypto from 'crypto';

import { User, UserStatus } from 'src/users/entities/user.entity';
import { ISessionService } from 'src/session/session';
import { Session } from 'src/session/entities/session.entity';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import ms from 'ms';
import { JwtService } from '@nestjs/jwt';
import { IAuthService } from './auth';
import { AuthRegisterDto } from './dtos/auth-register.dto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { compareHash } from 'src/utils/helpers';
import { IMailsService } from 'src/mails/mails';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { IForgotPasswordService } from 'src/forgot-password/forgot-password';
import { SocialType } from 'src/social/types/social.type';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Services.USERS) private readonly usersService: IUsersService,
    @Inject(Services.MAILS) private readonly mailsService: IMailsService,
    @Inject(Services.SESSION) private readonly sessionService: ISessionService,
    @Inject(Services.FORGOT_PASSWORD)
    private readonly forgotPasswordService: IForgotPasswordService,

    private readonly configService: ConfigService<AllConfigType>,
    private readonly jwtService: JwtService,
  ) {}

  async validateLogin(loginDto: AuthEmailLoginDto): Promise<LoginResponseType> {
    const user = await this.usersService.findOneUser({
      email: loginDto.email,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'notFound',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (user.provider !== AuthProvidersEnum.email) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: `needLoginViaProvider:${user.provider}`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isValidPassword = await compareHash(loginDto.password, user.password);

    if (!isValidPassword) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'incorrectPassword',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const session = await this.sessionService.create({
      user,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      sessionId: session.id,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
      user,
    };
  }
  async validateSocialLogin(
    authProvider: AuthProvidersEnum,
    socialData: SocialType,
  ): Promise<LoginResponseType> {
    let user: NullableType<User>;
    const socialEmail = socialData.email?.toLowerCase();

    const userByEmail = await this.usersService.findOneUser({
      email: socialEmail,
    });

    user = await this.usersService.findOneUser({
      socialId: socialData.id,
      provider: authProvider,
    });

    if (user) {
      if (socialEmail && !userByEmail) {
        user.email = socialEmail;
      }
      await this.usersService.saveUser(user);
    } else if (userByEmail) {
      user = userByEmail;
    } else {
      user = await this.usersService.createUser({
        email: socialEmail ?? null,
        firstName: socialData.firstName ?? null,
        lastName: socialData.lastName ?? null,
        socialId: socialData.id,
        provider: authProvider,
        status: UserStatus.Active,
      });

      user = await this.usersService.findOneUser({
        id: user.id,
      });
    }

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: 'userNotFound',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const session = await this.sessionService.create({
      user,
    });

    const {
      token: jwtToken,
      refreshToken,
      tokenExpires,
    } = await this.getTokensData({
      id: user.id,
      sessionId: session.id,
    });

    return {
      refreshToken,
      token: jwtToken,
      tokenExpires,
      user,
    };
  }

  async registerUser(registerDto: AuthRegisterDto): Promise<void> {
    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    await this.usersService.createUser({
      ...registerDto,
      email: registerDto.email,
      status: UserStatus.Inactive,
      hash,
    });

    await this.mailsService.confirmRegisterUser({
      to: registerDto.email,
      data: {
        hash,
        user: registerDto.firstName,
      },
    });
  }

  async status(userJwtPayload: JwtPayloadType): Promise<NullableType<User>> {
    return await this.usersService.findOneUser({
      id: userJwtPayload.id,
    });
  }

  async confirmEmail(hash: string): Promise<void> {
    const user = await this.usersService.findOneUser({
      hash,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `notFound`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    user.hash = null;
    user.status = UserStatus.Active;
    await this.usersService.saveUser(user);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findOneUser({
      email,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailNotExists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');
    await this.forgotPasswordService.create({
      hash,
      user,
    });

    await this.mailsService.forgotPassword({
      to: email,
      data: {
        hash,
        user: user.firstName,
      },
    });
  }

  async resetPassword(hash: string, password: string): Promise<void> {
    const forgotReq = await this.forgotPasswordService.findOne({
      where: {
        hash,
      },
    });

    if (!forgotReq) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            hash: `notFound`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const user = forgotReq.user;
    user.password = password;

    await this.sessionService.softDelete({
      user: {
        id: user.id,
      },
    });
    await this.usersService.saveUser(user);
    await this.forgotPasswordService.softDelete(forgotReq.id);
  }

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, 'sessionId'>,
  ): Promise<Omit<LoginResponseType, 'user'>> {
    const session = await this.sessionService.findOne({
      where: {
        id: data.sessionId,
      },
    });

    if (!session) {
      throw new UnauthorizedException();
    }

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: session.user.id,
      sessionId: session.id,
    });

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }

  async logout(data: Pick<JwtRefreshPayloadType, 'sessionId'>) {
    return this.sessionService.softDelete({
      id: data.sessionId,
    });
  }

  private async getTokensData(data: {
    id: User['id'];
    sessionId: Session['id'];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow<string>(
      'auth.expires',
      {
        infer: true,
      },
    );

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow<string>('auth.secret', {
            infer: true,
          }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow<string>('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow<string>(
            'auth.refreshExpires',
            {
              infer: true,
            },
          ),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}
