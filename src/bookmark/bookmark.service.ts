import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkData } from './validations/index';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  createBookmark = async (
    bookmark: CreateBookmarkData,
    userId: number,
    { repo = this.prisma.bookmark } = {},
  ) => {
    const result = await repo.create({ data: { ...bookmark, userId } });
    return result;
  };
}
