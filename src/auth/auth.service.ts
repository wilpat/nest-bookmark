import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserData, UserSignInData } from './validations';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private userService: UserService,
  ) {}
  async signup(data: CreateUserData, { repo = this.prisma.user } = {}) {
    try {
      const exists = await repo.findFirst({
        where: {
          email: data.email,
        },
      });
      if (exists) {
        throw new ConflictException('Credentials Taken');
      }
      const passwordHash = await hash(data.password);
      delete data.password;
      const user = await repo.create({
        data: {
          ...data,
          type: 'user',
          entity: 'user',
          hash: passwordHash,
        },
      });
      delete user.hash;
      const access_token = await this.signToken(
        user.id,
        user.email,
        user.type,
        user.entity,
      );
      return { ...user, access_token };
    } catch (error) {
      throw error;
    }
  }

  async signin(data: UserSignInData, { repo = this.prisma.user } = {}) {
    const user = await repo.findFirst({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Credentials do not match our records');
    }
    if (await verify(user.hash, data.password)) {
      delete user.hash;
      const access_token = await this.signToken(
        user.id,
        user.email,
        user.type,
        user.entity,
      );
      return { ...user, access_token };
    }
    throw new UnauthorizedException('Credentials do not match our records');
  }

  signToken(
    id: string | number,
    email: string,
    type: string,
    entity: string,
  ): Promise<string> {
    const secret = this.config.get('JWT_SECRET');
    const payload = {
      sub: id,
      email,
      type,
      entity,
    };
    return this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret,
    });
  }

  getEntityByEmailAndType = async (email: string, type: string) =>
    ((
      {
        user: () => this.userService.getUserByEmail(email),
      }[type] ||
      (() => Promise.reject(new UnauthorizedException('Unauthorized')))
    )());
}
