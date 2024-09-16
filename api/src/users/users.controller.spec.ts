import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../users/users.module';
import { faker } from '@faker-js/faker';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { BusinessLogicExceptionFilter } from '../shared/filters/business-logic-exception.filter';
import { UsersService } from './users.service';
import { plainToClass } from 'class-transformer';
import { UserDto } from './dto/user.dto';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { AuthService } from '../auth/auth.service';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  const testUser = {
    login: faker.internet.userName(),
    password: faker.internet.password({ prefix: 'Password123!' }),
    name: faker.person.fullName(),
  };
  const mockAuthService = {
    login: jest.fn().mockResolvedValue({ token: 'mocked-token' }),
    logout: jest.fn().mockResolvedValue(true),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, ...TypeOrmTestingConfig()],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(AuthService) // Mock AuthService
      .useValue(mockAuthService) // Use mock for AuthService
      .compile();

    const usersService = moduleFixture.get(UsersService);
    const adminUserDto = plainToClass(UserDto, testUser);
    await usersService.create(adminUserDto);

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new BusinessLogicExceptionFilter());
    await app.init();
  });

  it('should create a new user (201)', async () => {
    const mockUser = {
      login: faker.internet.userName(),
      name: faker.person.fullName(),
      password: faker.internet.password({ prefix: 'Password123!' }),
    };

    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer admin-token`)
      .send(mockUser)
      .expect(201)
      .expect(({ body }) => {
        expect(body.login).toBe(mockUser.login);
        expect(body.password).toBeUndefined();
        expect(body.name).toBe(mockUser.name);
      });
  });

  it('should return 400 if required fields are missing', () => {
    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer admin-token`)
      .send({
        name: faker.person.fullName(),
        password: faker.internet.password({ prefix: 'Password123!' }),
      })
      .expect(400);
  });

  it("Should return 400 if the user's password is invalid", () => {
    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer admin-token`)
      .send({
        login: faker.internet.userName(),
        name: faker.person.fullName(),
        password: 'password',
      })
      .expect(400);
  });

  it('should return 409 if the user already exists', async () => {
    const existingUser = {
      login: 'existingUser',
      name: faker.person.fullName(),
      password: faker.internet.password({ prefix: 'Password123!' }),
    };

    await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer admin-token`)
      .send(existingUser)
      .expect(201);

    // Creates the same user
    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer admin-token`)
      .send(existingUser)
      .expect(409)
      .expect(({ body }) => {
        expect(body.message).toBe('User already exists');
      });
  });

  it('should return 200 if the user logs in', async () => {
    return request(app.getHttpServer())
      .post('/users/login')
      .send()
      .expect(200)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
      });
  });

  it('should return 204 if the user logs out successfully', async () => {
    return request(app.getHttpServer())
      .post('/users/logout')
      .set('Authorization', `Bearer token`)
      .send()
      .expect(204)
      .expect(() => {
        expect(mockAuthService.logout).toHaveBeenCalled();
      });
  });
});
