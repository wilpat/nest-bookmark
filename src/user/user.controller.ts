import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { isAnyoneGuard } from '../auth/guards';
import { GetEntity } from '../auth/decorators';

@Controller('users')
export class UserController {
  // constructor() {}

  @UseGuards(isAnyoneGuard)
  @Get('me')
  getMe(@GetEntity() user: User) {
    return user;
  }
}
