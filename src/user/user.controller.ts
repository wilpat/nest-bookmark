import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { isAnyoneGuard } from '../auth/guards';
import { GetEntity } from '../auth/decorators';
import { UserService } from './user.service';
import { UpdateUserData } from './validations/index';
import { UtilsService } from '../utils/utils.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService, private utils: UtilsService) {}

  @UseGuards(isAnyoneGuard)
  @Get('me')
  getMe(@GetEntity() user: User) {
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(isAnyoneGuard)
  @Patch('')
  updateUser(@Body() body: UpdateUserData, @GetEntity('email') email: string) {
    return this.userService.update(email, body, {
      sanitizeEntity: this.utils.sanitizeEntity,
    });
  }
}
