import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async generateToken() {
    const tokenId = randomUUID();

    return this.signToken(tokenId);
  }

  private async signToken(tokenId: string) {
    return this.jwtService.signAsync(
      {
        sub: tokenId,
      },
      {
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.tokenTtl,
      },
    );
  }
}
