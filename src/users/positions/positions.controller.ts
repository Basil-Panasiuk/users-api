import { Controller, Get } from '@nestjs/common';
import { PositionsService } from './positions.service';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  async findAll() {
    const positions = await this.positionsService.findAll();
    return {
      success: true,
      positions,
    };
  }
}
