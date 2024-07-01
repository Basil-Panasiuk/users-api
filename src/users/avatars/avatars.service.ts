import { Inject, Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { AVATAR_RESOLUTION } from '../users.constants';
import { randomUUID } from 'crypto';
import tinify from 'tinify';
import appConfig from 'src/common/config/app.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AvatarsService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
  ) {
    tinify.key = this.appConfiguration.tinifyApiKey;
  }

  async persist(file: Express.Multer.File) {
    const imageBuffer = await sharp(file.buffer)
      .resize(AVATAR_RESOLUTION, AVATAR_RESOLUTION, {
        fit: sharp.fit.cover,
        position: sharp.strategy.attention,
      })
      .toBuffer();

    const optimizedImageBuffer = await this.optimize(imageBuffer);

    const avatarPath = `users/${randomUUID()}.jpg`;
    await sharp(optimizedImageBuffer).toFile(`images/${avatarPath}`);

    return avatarPath;
  }

  private optimize(buffer: Buffer) {
    return new Promise((resolve, reject) => {
      tinify.fromBuffer(buffer).toBuffer((err, resultData) => {
        err ? reject(err) : resolve(resultData);
      });
    });
  }
}
