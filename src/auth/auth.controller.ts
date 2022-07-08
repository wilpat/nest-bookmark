import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserData, UserSignInData } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() UserModel: CreateUserData) {
    return this.authService.signup(UserModel);
  }

  @Post('signin')
  signin(@Body() data: UserSignInData) {
    return this.authService.signin(data);
  }
}
