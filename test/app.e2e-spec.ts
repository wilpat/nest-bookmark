import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateUserData, UserSignInData } from '../src/auth/dto/auth.dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen('3334');

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    describe('Signup', () => {
      it('Should sign up', () => {
        const userData: CreateUserData = {
          email: 'test@gmail.com',
          password: '123',
          firstName: 'first',
          lastName: 'first',
        };
        return pactum
          .spec()
          .post('http://localhost:3334/auth/signup')
          .withBody(userData)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('Should sign in', () => {
        const userData: UserSignInData = {
          email: 'test@gmail.com',
          password: '123',
        };
        return pactum
          .spec()
          .post('http://localhost:3334/auth/signin')
          .withBody(userData)
          .expectStatus(200);
      });
    });
  });
});
