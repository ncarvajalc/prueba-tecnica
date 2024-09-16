import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { RevokedTokenEntity } from '../entities/revoked-token.entity';

@Injectable()
export class RevokedTokenCleanupService {
  constructor(
    @InjectRepository(RevokedTokenEntity)
    private readonly revokedTokenRepository: Repository<RevokedTokenEntity>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanUpOldRevokedTokens() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    await this.revokedTokenRepository.delete({
      revokedAt: LessThan(oneWeekAgo),
    });

    console.log('Revoked tokens older than 7 days have been cleaned up');
  }
}
