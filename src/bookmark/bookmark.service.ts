import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkData, EditBookmarkData } from './validations/index';

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

  getBookmarkById = async (
    userId: number,
    bookmarkId: number,
    { repo = this.prisma.bookmark } = {},
  ) =>
    await repo
      .findFirst({ where: { id: bookmarkId, userId } })
      .then((res) =>
        res ? res : Promise.reject(new NotFoundException('Bookmark not found')),
      );

  getUserBookmarks = async (
    userId: number,
    { repo = this.prisma.bookmark } = {},
  ) =>
    await repo.findMany({
      where: {
        userId,
      },
    });

  updateBookmarkById = async (
    userId: number,
    bookmarkId: number,
    bookmark: EditBookmarkData,
    { repo = this.prisma.bookmark } = {},
  ) => {
    return repo
      .updateMany({
        where: {
          id: bookmarkId,
          userId,
        },
        data: bookmark,
      })
      .then(async (res) =>
        res.count
          ? await repo.findUnique({ where: { id: bookmarkId } })
          : await Promise.reject(new NotFoundException('Bookmark not found')),
      );
  };

  deleteBookmarkById = async (
    userId: number,
    bookmarkId: number,
    { repo = this.prisma.bookmark } = {},
  ) => {
    return repo
      .deleteMany({
        where: {
          id: bookmarkId,
          userId,
        },
      })
      .then(async (res) =>
        res.count
          ? 'Deleted'
          : await Promise.reject(new NotFoundException('Bookmark not found')),
      );
  };
}
