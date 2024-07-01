import { Injectable } from '@nestjs/common';
import { RedisRepository } from './redis.repository';

@Injectable()
export class RedisService {
  constructor(private readonly redisRepository: RedisRepository) {}

  storeToken(tokenId: string, userId: number) {
    return this.redisRepository.set(tokenId, userId.toString());
  }

  async isTokenUsed(tokenId: string) {
    const userId = await this.redisRepository.get(tokenId);

    return !!userId;
  }
}
