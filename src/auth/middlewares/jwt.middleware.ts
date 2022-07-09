import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { UtilsService } from '../../utils/utils.service';

@Injectable()
export class JwtMiddleware extends PassportStrategy(Strategy, 'isAnyone') {
  constructor(
    config: ConfigService,
    private auth: AuthService,
    private utils: UtilsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
  async validate(payload: {
    sub: string | number;
    email: string;
    type: string;
  }) {
    const user = await this.auth.getEntityByEmailAndType(
      payload.email,
      payload.type,
    );
    delete user.hash;
    return user;
  }
}
