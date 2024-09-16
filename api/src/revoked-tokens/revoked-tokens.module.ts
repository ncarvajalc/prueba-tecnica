import { RevokedTokenEntity } from './entities/revoked-token.entity';
import { Module } from '@nestjs/common';
import { RevokedTokenService } from './revoked-tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RevokedTokenCleanupService } from './cleanup-service/revoked-token-cleanup.service';

@Module({
  imports: [TypeOrmModule.forFeature([RevokedTokenEntity])],
  providers: [RevokedTokenService, RevokedTokenCleanupService],
})
export class RevokedTokensModule {}
