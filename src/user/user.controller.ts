import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { isAnyoneGuard } from 'src/auth/guards';
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
