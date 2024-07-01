import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationService } from './authentication.service';
import { TokenGuard } from './guards/token.guard';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    RedisModule,
  ],
  providers: [AuthenticationService, TokenGuard],
  controllers: [AuthenticationController],
  exports: [TokenGuard, JwtModule, ConfigModule],
})
export class AuthenticationModule {}
