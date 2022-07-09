import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtMiddleware } from './middlewares';
import { UserService } from '../user/user.service';
import { UtilsService } from '../utils/utils.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtMiddleware, UserService, UtilsService],
})
export class AuthModule {}
