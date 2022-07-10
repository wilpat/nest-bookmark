import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateUserData, UserSignInData } from '../src/auth/validations';

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
    pactum.request.setBaseUrl('http://localhost:3334/');
    await prisma.cleanDb();
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const userData: CreateUserData = {
      email: 'test@gmail.com',
      password: '123',
      firstName: 'first',
      lastName: 'first',
    };
    describe('Signup', () => {
      it('Should should throw if email is empty', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody({ ...userData, email: '' })
          .expectStatus(400);
      });

      it('Should should throw if password is empty', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody({ ...userData, password: '' })
          .expectStatus(400);
      });

      it('Should should throw if body is empty', () => {
        return pactum.spec().post('auth/signup').expectStatus(400);
      });

      it('Should sign up', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody(userData)
          .expectStatus(201);
      });

      it('Should throw if email is taken', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody(userData)
          .expectStatus(409);
      });
    });

    describe('Signin', () => {
      const userData: UserSignInData = {
        email: 'test@gmail.com',
        password: '123',
      };
      it('Should throw if password is emtpty', () => {
        return pactum
          .spec()
          .post('auth/signin')
          .withBody({ ...userData, password: '' })
          .expectStatus(400);
      });
      it('Should throw if email is empty', () => {
        return pactum
          .spec()
          .post('auth/signin')
          .withBody({ ...userData, email: '' })
          .expectStatus(400);
      });

      it('Should fail to sign in', () => {
        return pactum
          .spec()
          .post('auth/signin')
          .withBody({ ...userData, password: '22' })
          .expectStatus(401);
      });

      it('Should sign in', () => {
        return pactum
          .spec()
          .post('auth/signin')
          .withBody(userData)
          .expectStatus(200)
          .stores('accessToken', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('users/me')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200);
      });
    });
    describe('Update user', () => {
      it('should get update the current user', () => {
        return pactum
          .spec()
          .patch('users')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({ firstName: 'New Name' })
          .expectStatus(200)
          .expectBodyContains('New Name');
      });
    });
  });
});
