import { Test, TestingModule } from '@nestjs/testing';
import { AuthGoogleController } from '../auth-google.controller';

describe('AuthGoogleController', () => {
  let controller: AuthGoogleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthGoogleController],
    }).compile();

    controller = module.get<AuthGoogleController>(AuthGoogleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
