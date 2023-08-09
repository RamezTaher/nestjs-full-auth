import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from 'src/utils/constants';
import { Session } from './entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session])],

  providers: [
    {
      provide: Services.SESSION,
      useClass: SessionService,
    },
  ],
  exports: [
    {
      provide: Services.SESSION,
      useClass: SessionService,
    },
  ],
})
export class SessionModule {}
