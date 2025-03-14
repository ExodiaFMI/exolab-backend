import { IsString, IsEmail, MinLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { User } from './user.entity';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @Expose()
  name!: string;

  @IsEmail()
  @Expose()
  email!: string;

  @IsString()
  @MinLength(6)
  @Expose()
  password!: string;

  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
}

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
  }
}
