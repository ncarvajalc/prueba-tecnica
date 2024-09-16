import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UserDto {
  @ApiProperty({
    description: 'User login',
    type: String,
    required: true,
    example: 'user',
  })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({
    description: 'User password',
    type: String,
    required: true,
    example: 'Password123!',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'User name',
    type: String,
    required: true,
    example: 'User Name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
