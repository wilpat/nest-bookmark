import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  Body,
} from '@nestjs/common';
import { GetEntity } from '../auth/decorators';
import { isAnyoneGuard } from '../auth/guards/is-anyone.guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkData } from './validations/index';

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
  getUserBookmarks(@GetEntity('id') userId: number | string) {
    return 'user bookmarks';
  }

  @Get('')
  getBookmarks() {
    return 'all bookmarks';
  }

  @Get('/:bookmarkId')
  getBookmarkById() {
    return 'single bookmarks';
  }

  @Patch('/:bookmarkId')
  updateBookmarkById() {
    return 'update bookmark';
  }

  @Delete('/:bookmarkId')
  deleteBookmarkById() {
    return 'delete bookmark';
  }
}
