import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UtilsService {
  sanitizeEntity = (entity: User | { hash: string }): object => {
    delete entity.hash;
    return entity;
  };
}
