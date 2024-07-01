import { Controller, Get } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

@Controller()
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Get('token')
  async generateToken() {
    const token = await this.authService.generateToken();
    return {
      success: true,
      token,
    };
  }
}
