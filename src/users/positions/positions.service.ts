import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from './entities/position.entity';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) {}

  findAll() {
    return this.positionRepository.find();
  }

  async findOne(id: number) {
    const position = await this.positionRepository.findOneBy({ id });
    if (!position) {
      throw new BadRequestException({
        message: [`position_id:Position with id #'${id}' does not exist.`],
      });
    }
    return position;
  }
}
