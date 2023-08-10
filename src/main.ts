import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from './config/config.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const configService = app.get(ConfigService<AllConfigType>);

  try {
    const PORT = configService.getOrThrow('app.port', { infer: true });
    await app.listen(PORT, () => {
      console.log(`Running on Port ${PORT}`);
      console.log(
        `Running in ${configService.getOrThrow('app.nodeEnv', {
          infer: true,
        })} `,
      );
    });
  } catch (err) {
    console.log(err);
  }
}

void bootstrap();
