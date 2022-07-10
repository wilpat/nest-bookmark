import { Module } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UtilsService],
})
export class UserModule {}
