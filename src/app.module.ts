import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './session/session.module';
import { MailerModule } from './mailer/mailer.module';
import { MailsModule } from './mails/mails.module';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import mailerConfig from './config/mailer.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, authConfig, mailerConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    UsersModule,
    AuthModule,
    SessionModule,
    MailerModule,
    MailsModule,
  ],
})
export class AppModule {}
