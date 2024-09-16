import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RevokedTokenEntity } from './entities/revoked-token.entity';

@Injectable()
export class RevokedTokenService {
  constructor(
    @InjectRepository(RevokedTokenEntity)
    private readonly revokedTokenRepository: Repository<RevokedTokenEntity>,
  ) {}

  async revokeToken(token: string): Promise<RevokedTokenEntity> {
    const revokedToken = this.revokedTokenRepository.create({ token });
    return await this.revokedTokenRepository.save(revokedToken);
  }

  async isTokenRevoked(token: string): Promise<boolean> {
    const revokedToken = await this.revokedTokenRepository.findOne({
      where: { token },
    });
    return !!revokedToken;
  }
}
