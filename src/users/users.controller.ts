import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  Query,
  UsePipes,
  UseGuards,
  UnauthorizedException,
  UseFilters,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { TokenGuard } from 'src/authentication/guards/token.guard';
import { TokenId } from 'src/authentication/decorators/token-id.decorator';
import { RedisService } from 'src/redis/redis.service';
import { ValidationExeptionFilter } from 'src/common/filters/validation-exeption.filter';
import { filePipeConfig } from './pipes/file-pipe.config';
import { FindUserParamDto } from './dto/find-user-param.dto';

@Controller('users')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
  ) {}

  @Post()
  @UseGuards(TokenGuard)
  @UseInterceptors(FileInterceptor('photo'))
  @UseFilters(new ValidationExeptionFilter('Validation failed'))
  async create(
    @Body()
    createUserDto: CreateUserDto,
    @TokenId() tokenId: string,
    @UploadedFile(new ParseFilePipe(filePipeConfig))
    file: Express.Multer.File,
  ) {
    if (await this.redisService.isTokenUsed(tokenId)) {
      throw new UnauthorizedException({
        success: false,
        message: 'Token has already been used',
      });
    }
    const user = await this.usersService.create(createUserDto, file);
    await this.redisService.storeToken(tokenId, user.id);

    return {
      success: true,
      user_id: user.id,
      message: 'New user successfully registered',
    };
  }

  @Get()
  @UseFilters(new ValidationExeptionFilter('Validation failed'))
  async findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    const result = await this.usersService.findAll(paginationQueryDto);

    return {
      success: true,
      ...result,
    };
  }

  @Get(':id')
  @UseFilters(
    new ValidationExeptionFilter(
      'The user with the requested id does not exist',
      HttpStatus.BAD_REQUEST,
    ),
  )
  async findOne(
    @Param()
    findUserParamDto: FindUserParamDto,
  ) {
    const user = await this.usersService.findOne(findUserParamDto.id);

    return {
      success: true,
      user,
    };
  }
}
