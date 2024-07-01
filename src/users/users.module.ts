import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PositionsController } from './positions/positions.controller';
import { PositionsService } from './positions/positions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AvatarsService } from './avatars/avatars.service';
import { ConfigModule } from '@nestjs/config';
import imageConfig from 'src/common/config/app.config';
import { Position } from './positions/entities/position.entity';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Position]),
    ConfigModule.forFeature(imageConfig),
    AuthenticationModule,
    RedisModule,
  ],
  controllers: [UsersController, PositionsController],
  providers: [UsersService, PositionsService, AvatarsService],
})
export class UsersModule {}
