import { Test, TestingModule } from '@nestjs/testing';
import { AuthGoogleService } from '../auth-google.service';

describe('AuthGoogleService', () => {
  let service: AuthGoogleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGoogleService],
    }).compile();

    service = module.get<AuthGoogleService>(AuthGoogleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
