import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AvatarsService } from './avatars/avatars.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PositionsService } from './positions/positions.service';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import appConfig from 'src/common/config/app.config';
import { ConfigType } from '@nestjs/config';
import { TimestampTransformer } from 'src/common/transforms/timestamp.transform';

@Injectable()
export class UsersService {
  constructor(
    private readonly avatarsService: AvatarsService,
    private readonly positionsService: PositionsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
  ) {}

  async create(createUserDto: CreateUserDto, file: Express.Multer.File) {
    const { email, phone, position_id } = createUserDto;
    await this.checkUserExists(email, phone);

    const avatar = await this.avatarsService.persist(file);
    const position = await this.positionsService.findOne(position_id);

    const user = this.userRepository.create({
      ...createUserDto,
      position,
      photo: avatar,
    });

    return this.userRepository.save(user);
  }

  async findAll({ count, page }: PaginationQueryDto) {
    const [users, total] = await this.userRepository.findAndCount({
      relations: ['position'],
      order: { id: 'ASC' },
      skip: (page - 1) * count,
      take: count,
    });

    const totalPages = Math.ceil(total / count);

    if (page > totalPages) {
      throw new NotFoundException({
        success: false,
        message: 'Page not found',
      });
    }

    const userDtos = users.map((user) => this.toUserListResponseDto(user));

    return {
      total_pages: totalPages,
      total_users: total,
      count,
      page,
      links: {
        next_url:
          page < totalPages ? this.paginationUrl(page + 1, count) : null,
        prev_url: page > 1 ? this.paginationUrl(page - 1, count) : null,
      },
      users: userDtos,
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['position'],
    });
    if (!user) {
      throw new NotFoundException({
        success: false,
        message: 'User not found',
      });
    }

    return this.toUserResponseDto(user);
  }

  private toUserResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      photo: `${this.appConfiguration.baseUrl}/images/${user.photo}`,
      position: user.position.name,
      position_id: user?.position?.id,
    };
  }

  private toUserListResponseDto(user: User): UserResponseDto {
    return {
      ...this.toUserResponseDto(user),
      registration_timestamp: TimestampTransformer.convert(
        user.registrationTimestamp,
      ),
    };
  }

  private paginationUrl(page: number, count: number): string {
    return `${this.appConfiguration.baseUrl}/users?page=${page}&count=${count}`;
  }

  private async checkUserExists(email: string, phone: string) {
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { phone }],
    });

    if (existingUser) {
      throw new ConflictException({
        success: false,
        message: 'User with this phone or email already exists',
      });
    }
  }
}
