import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RevokedTokenService } from 'src/revoked-tokens/revoked-tokens.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly revokedTokenService: RevokedTokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: process.env.NODE_ENV === 'development',
      secretOrKey: configService.get('jwt.secret'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: { iat: number; exp: number; login: string },
  ) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    const isRevoked = await this.revokedTokenService.isTokenRevoked(token);
    if (isRevoked) {
      throw new UnauthorizedException();
    }

    return {
      iat: payload.iat,
      exp: payload.exp,
      login: payload.login,
    };
  }
}
