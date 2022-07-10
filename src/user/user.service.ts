import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserData } from './validations/index';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  getUserByEmail = async (email: string, { repo = this.prisma.user } = {}) =>
    repo.findUnique({
      where: {
        email,
      },
    });
  update = async (
    user: User,
    data: UpdateUserData,
    { repo = this.prisma.user, sanitizeEntity = (props) => null } = {},
  ) => {
    const updatedUser = await repo.update({
      where: {
        email: user.email,
      },
      data,
    });
    return sanitizeEntity(updatedUser);
  };
}
