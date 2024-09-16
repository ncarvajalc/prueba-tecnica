import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import {
  comparePassword,
  hashPassword,
} from '../shared/security/password-utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: UserDto): Promise<UserEntity> {
    const { login, password } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { login },
    });
    if (existingUser) {
      throw new BusinessLogicException(
        'User already exists',
        BusinessError.ALREADY_EXISTS,
      );
    }
    if (
      password.length < 8 ||
      !password.match(/[A-Z]/) ||
      !password.match(/[a-z]/) ||
      !password.match(/[0-9]/) ||
      !password.match(/[^A-Za-z0-9]/)
    ) {
      throw new BusinessLogicException(
        'Password must have at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character',
        BusinessError.BAD_REQUEST,
      );
    }

    const hashedPassword = await hashPassword(password);
    createUserDto.password = hashedPassword;
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(login: string) {
    const user = await this.userRepository.findOne({ where: { login } });
    if (!user) {
      throw new BusinessLogicException(
        'The user with the given login was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return user;
  }

  async login(login: string, password: string) {
    const user = await this.userRepository.findOne({ where: { login } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async update(login: string, updateUserDto: UserDto) {
    const persistedUser = await this.userRepository.findOne({
      where: { login },
    });

    if (!persistedUser) {
      throw new BusinessLogicException(
        'The user with the given login was not found',
        BusinessError.NOT_FOUND,
      );
    }

    return this.userRepository.save({
      ...persistedUser,
      ...updateUserDto,
    });
  }

  async remove(login: string) {
    const user = await this.userRepository.findOne({ where: { login } });
    if (!user) {
      throw new BusinessLogicException(
        'The user with the given login was not found',
        BusinessError.NOT_FOUND,
      );
    }

    return this.userRepository.remove(user);
  }
}
