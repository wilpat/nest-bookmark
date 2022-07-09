import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  getUserByEmail = async (email: string) =>
    this.prisma.user.findUnique({
      where: {
        email,
      },
    });
}
