import { AuthGuard } from '@nestjs/passport';

export class isAnyoneGuard extends AuthGuard('isAnyone') {
  constructor() {
    super();
  }
}
