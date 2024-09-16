import { RevokedTokenEntity } from './../revoked-tokens/entities/revoked-token.entity';
import { RevokedTokenService } from '../revoked-tokens/revoked-tokens.service';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RevokedTokenEntity])],
  providers: [
    UsersService,
    AuthService,
    JwtService,
    ConfigService,
    RevokedTokenService,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
