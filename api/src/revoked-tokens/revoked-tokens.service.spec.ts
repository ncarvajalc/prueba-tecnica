import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RevokedTokenService } from './revoked-tokens.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RevokedTokenEntity } from './entities/revoked-token.entity';

describe('RevokedTokenService', () => {
  let service: RevokedTokenService;
  let repository: Repository<RevokedTokenEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RevokedTokenService],
    }).compile();

    service = module.get<RevokedTokenService>(RevokedTokenService);
    repository = module.get<Repository<RevokedTokenEntity>>(
      getRepositoryToken(RevokedTokenEntity),
    );

    // Clear the repository before each test
    await repository.clear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('revokeToken', () => {
    it('should save the token in the revoked tokens repository', async () => {
      const token = 'test-token';
      const revokedToken = await service.revokeToken(token);

      expect(revokedToken).toBeDefined();
      expect(revokedToken.token).toBe(token);

      const storedToken = await repository.findOne({ where: { token } });
      expect(storedToken).not.toBeNull();
      expect(storedToken.token).toBe(token);
    });
  });

  describe('isTokenRevoked', () => {
    it('should return true if the token is revoked', async () => {
      const token = 'test-token';

      await service.revokeToken(token);

      const isRevoked = await service.isTokenRevoked(token);
      expect(isRevoked).toBe(true);
    });

    it('should return false if the token is not revoked', async () => {
      const token = 'test-token';

      const isRevoked = await service.isTokenRevoked(token);
      expect(isRevoked).toBe(false);
    });
  });
});
