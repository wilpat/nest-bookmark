import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthService } from '../src/auth/auth.service';
import { CreateUserData, UserSignInData } from '../src/auth/validations';
import { CreateBookmarkData } from '../src/bookmark/validations/index';
describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let auth: AuthService;
  // beforeEach(async () => {
  //   await prisma.cleanDb();
  // });

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
    // auth = app.get(AuthService);
    // console.log({ auth: auth.signup });
    pactum.request.setBaseUrl('http://localhost:3334/');
  });

  afterAll(async () => {
    await prisma.cleanDb();
    app.close();
  });
  const createUserData: CreateUserData = {
    email: 'test@gmail.com',
    password: '123',
    firstName: 'first',
    lastName: 'first',
  };
  describe('Auth', () => {
    describe('Signup', () => {
      it('Should should throw if email is empty', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody({ ...createUserData, email: '' })
          .expectStatus(400);
      });

      it('Should should throw if password is empty', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody({ ...createUserData, password: '' })
          .expectStatus(400);
      });

      it('Should should throw if body is empty', () => {
        return pactum.spec().post('auth/signup').expectStatus(400);
      });

      it('Should sign up', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody(createUserData)
          .expectStatus(201);
      });

      it('Should throw if email is taken', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody(createUserData)
          .expectStatus(409);
      });
    });

    describe('Signin', () => {
      const userData: UserSignInData = {
        email: 'test@gmail.com',
        password: '123',
      };
      it('Should throw if password is empty', () => {
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
      it('Should fail to sign in with incorrect credentials', () => {
        return pactum
          .spec()
          .post('auth/signin')
          .withBody({ ...userData, password: '22' })
          .expectStatus(401);
      });
      console.log('Runnernmksdfsndfsd');
      // auth.signup(createUserData);
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
  describe('Bookmark', () => {
    const bookmarkData: CreateBookmarkData = {
      title: 'sample title',
      description: 'sample description',
      link: 'google.com',
    };
    it('should create a bookmark', () => {
      return pactum
        .spec()
        .post('bookmarks')
        .withHeaders({
          Authorization: 'Bearer $S{accessToken}',
        })
        .withBody(bookmarkData)
        .expectStatus(201)
        .stores('bookmarkId', 'id')
        .expectBodyContains('sample title');
    });

    it('should fetch a bookmark', () => {
      return pactum
        .spec()
        .withHeaders({
          Authorization: 'Bearer $S{accessToken}',
        })
        .get('bookmarks/{id}')
        .withPathParams('id', '$S{bookmarkId}')
        .expectStatus(200)
        .expectBodyContains('sample title');
    });

    it('should update a bookmark', () => {
      return pactum
        .spec()
        .withHeaders({
          Authorization: 'Bearer $S{accessToken}',
        })
        .patch('bookmarks/{id}')
        .withPathParams('id', '$S{bookmarkId}')
        .withBody({
          ...bookmarkData,
          title: 'updated title',
        })
        .expectStatus(200)
        .expectBodyContains('updated title');
    });

    it('should fetch all user bookmarks', () => {
      return pactum
        .spec()
        .withHeaders({
          Authorization: 'Bearer $S{accessToken}',
        })
        .get('bookmarks/user')
        .expectStatus(200)
        .inspect()
        .expectJsonLength(1);
    });

    it('should delete a bookmark', () => {
      return pactum
        .spec()
        .withHeaders({
          Authorization: 'Bearer $S{accessToken}',
        })
        .delete('bookmarks/{id}')
        .withPathParams('id', '$S{bookmarkId}')
        .expectStatus(204);
    });
  });
});
