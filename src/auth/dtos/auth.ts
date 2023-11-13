import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    description: 'Email del usuario',
    type: String,
    example: 'campos.aaron.15@gmail.com'
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password del usuario',
    minLength: 6,
    type: String,
    example: '123456'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}