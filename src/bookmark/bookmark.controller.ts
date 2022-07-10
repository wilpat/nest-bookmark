import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { GetEntity } from '../auth/decorators';
import { isAnyoneGuard } from '../auth/guards/is-anyone.guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkData, EditBookmarkData } from './validations/index';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}
  @UseGuards(isAnyoneGuard)
  @Post('')
  createBookmark(
    @Body() bookmark: CreateBookmarkData,
    @GetEntity('id') userId: number,
  ) {
    return this.bookmarkService.createBookmark(bookmark, userId);
  }

  @UseGuards(isAnyoneGuard)
  @Get('user')
  getUserBookmarks(@GetEntity('id') userId: number) {
    return this.bookmarkService.getUserBookmarks(userId);
  }

  @Get('/:bookmarkId')
  getBookmarkById(
    @GetEntity('id') userId: number,
    @Param('bookmarkId', ParseIntPipe) bookmarkId: number,
  ) {
    const bookmark = this.bookmarkService.getBookmarkById(userId, bookmarkId);
    console.log({ bookmark });
    return bookmark;
  }

  @Patch('/:bookmarkId')
  async updateBookmarkById(
    @GetEntity('id') userId: number,
    @Body() bookmark: EditBookmarkData,
    @Param('bookmarkId', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.updateBookmarkById(
      userId,
      bookmarkId,
      bookmark,
    );
  }

  @Delete('/:bookmarkId')
  deleteBookmarkById(
    @GetEntity('id') userId: number,
    @Param('bookmarkId', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
  }
}
