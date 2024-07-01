import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({
    message: 'name:The name field is required.',
  })
  @IsString({
    message: 'name:The name must be a string.',
  })
  @Length(2, 60, {
    message: 'name:The name must be between 2 - 60 characters.',
  })
  name: string;

  @IsNotEmpty({
    message: 'email:The email field is required.',
  })
  @IsEmail(
    {},
    {
      message: 'email:The email must be a valid email address.',
    },
  )
  email: string;

  @IsNotEmpty({
    message: 'phone:The phone field is required.',
  })
  @Matches(/^\+380\d{9}$/, {
    message:
      'phone:Phone number must start with code of Ukraine +380 and has right length',
  })
  phone: string;

  @Type(() => Number)
  @IsNotEmpty({
    message: 'position_id:The position id field is required.',
  })
  @IsInt({ message: 'position_id:The position id must be an integer.' })
  @IsPositive({
    message: 'position_id:The position id must be at least  1.',
  })
  position_id: number;
}
