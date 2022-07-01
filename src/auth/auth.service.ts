import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signup() {
    return { foo: 'bar' };
  }

  signin() {
    return 'signin';
  }
}
