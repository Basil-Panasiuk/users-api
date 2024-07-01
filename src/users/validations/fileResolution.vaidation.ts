import { FileValidator } from '@nestjs/common';
import * as sharp from 'sharp';

interface FileResolutionOptions {
  resolution: number;
}

export class FileResolutionValidator extends FileValidator {
  private _resolution: number;

  constructor(protected readonly validationOptions: FileResolutionOptions) {
    super(validationOptions);
    this._resolution = this.validationOptions.resolution;
  }

  public async isValid(file?: Express.Multer.File): Promise<boolean> {
    const imageMetadata = await sharp(file.buffer).metadata();
    if (
      imageMetadata.width < this._resolution ||
      imageMetadata.height < this._resolution
    ) {
      return false;
    }
    return true;
  }

  public buildErrorMessage(): string {
    return `Resolution of image should be at least ${this._resolution}x${this._resolution}px`;
  }
}
