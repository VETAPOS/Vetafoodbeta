import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get('me')
  getSession() {
    return { message: 'Auth placeholder endpoint' };
  }
}
