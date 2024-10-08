import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../users/entities/user.entity';
import { RevokedTokenService } from '../revoked-tokens/revoked-tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private revokedTokenService: RevokedTokenService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserEntity | null> {
    try {
      const user = await this.usersService.login(username, password);
      return user;
    } catch (error) {
      return null;
    }
  }

  async login(req: any) {
    const payload = { login: req.user.login, sub: req.user.id };
    return {
      token: this.jwtService.sign(payload, {
        secret: this.configService.get('jwt.secret'),
        expiresIn: this.configService.get('jwt.expiresIn'),
      }),
    };
  }

  async logout(req: any) {
    const bearerToken = req.headers['authorization'];
    const token = bearerToken.split(' ')[1];
    await this.revokedTokenService.revokeToken(token);
  }
}
