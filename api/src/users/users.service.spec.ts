import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

import { faker } from '@faker-js/faker';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<UserEntity>;
  let countriesList: UserEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    countriesList = [];
    for (let i = 0; i < 5; i++) {
      const user: UserEntity = await repository.save({
        login: faker.internet.userName(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
      });
      countriesList.push(user);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all countries', async () => {
    const countries: UserEntity[] = await service.findAll();
    expect(countries).not.toBeNull();
    expect(countries).toHaveLength(countriesList.length);
  });

  it('findOne should return a user by login', async () => {
    const storedUser: UserEntity = countriesList[0];
    const user: UserEntity = await service.findOne(storedUser.login);
    expect(user).not.toBeNull();
    expect(user.name).toEqual(storedUser.name);
  });

  it('findOne should throw an exception for an invalid user', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The user with the given login was not found',
    );
  });

  it('create should return a new user', async () => {
    const user: UserEntity = {
      id: '',
      login: faker.internet.userName(),
      name: faker.person.fullName(),
      password: faker.internet.password({ prefix: 'Password123!' }),
    };

    const newUser: UserEntity = await service.create(user);
    expect(newUser).not.toBeNull();

    const storedUser: UserEntity = await repository.findOne({
      where: { login: newUser.login },
    });
    expect(storedUser).not.toBeNull();
    expect(storedUser.name).toEqual(newUser.name);
  });

  it('update should modify a user', async () => {
    const user: UserEntity = countriesList[0];
    user.name = 'New name';

    const updatedUser: UserEntity = await service.update(user.login, user);
    expect(updatedUser).not.toBeNull();

    const storedUser: UserEntity = await repository.findOne({
      where: { login: user.login },
    });
    expect(storedUser).not.toBeNull();
    expect(storedUser.name).toEqual(user.name);
  });

  it('update should throw an exception for an invalid user', async () => {
    let user: UserEntity = countriesList[0];
    user = {
      ...user,
      name: 'New name',
    };
    await expect(() => service.update('0', user)).rejects.toHaveProperty(
      'message',
      'The user with the given login was not found',
    );
  });

  it('remove should remove a user', async () => {
    const user: UserEntity = countriesList[0];
    await service.remove(user.login);

    const deletedUser: UserEntity = await repository.findOne({
      where: { login: user.login },
    });
    expect(deletedUser).toBeNull();
  });

  it('remove should throw an exception for an invalid user', async () => {
    await expect(service.remove('0')).rejects.toHaveProperty(
      'message',
      'The user with the given login was not found',
    );
  });
});
