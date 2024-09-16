import { Test, TestingModule } from '@nestjs/testing';
import { RevokedTokenCleanupService } from './revoked-token-cleanup.service';
import { TypeOrmTestingConfig } from '../../shared/testing-utils/typeorm-testing-config';

describe('RevokedTokenCleanupService', () => {
  let service: RevokedTokenCleanupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RevokedTokenCleanupService],
    }).compile();

    service = module.get<RevokedTokenCleanupService>(
      RevokedTokenCleanupService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
