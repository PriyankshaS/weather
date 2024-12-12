import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('login') // POST endpoint to login and return JWT token
  async login(@Body() authPayload: AuthPayloadDto) {
    const user = await this.authService.validateUser(authPayload);
    if (!user) {
      throw new HttpException('Invalid credentials', 401); // Invalid login
    }
    return this.authService.signInUser(user.id); // Return JWT token if valid
  }
}