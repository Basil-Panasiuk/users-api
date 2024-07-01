import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFileOptions,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FileResolutionValidator } from '../validations/fileResolution.vaidation';
import {
  AVATAR_RESOLUTION,
  AVATAR_TYPE,
  MAX_AVATAR_SIZE,
} from '../users.constants';

export const filePipeConfig: ParseFileOptions = {
  validators: [
    new MaxFileSizeValidator({ maxSize: MAX_AVATAR_SIZE }),
    new FileTypeValidator({ fileType: AVATAR_TYPE }),
    new FileResolutionValidator({ resolution: AVATAR_RESOLUTION }),
  ],
  exceptionFactory: (error) => {
    return new UnprocessableEntityException({
      success: false,
      fails: {
        photo: [error],
      },
    });
  },
};
