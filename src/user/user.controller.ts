import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('users')
export class UserController {
  // constructor() {}

  @UseGuards(AuthGuard('isAnyone'))
  @Get('me')
  getMe(@Req() req: Request) {
    return req.user;
  }
}
