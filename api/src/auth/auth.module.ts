import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigService
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { RevokedTokenService } from '../revoked-tokens/revoked-tokens.service';
import { RevokedTokenEntity } from '../revoked-tokens/entities/revoked-token.entity';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity, RevokedTokenEntity]),
  ],
  providers: [
    AuthService,
    JwtService,
    UsersService,
    JwtStrategy,
    LocalStrategy,
    ConfigService,
    RevokedTokenService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
