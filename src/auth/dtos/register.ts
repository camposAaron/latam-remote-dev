import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

export default class RegisterDto {
  @ApiProperty({
    description: 'Email del usuario',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    minLength: 6,
    type: String,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Repetir contraseña del usuario',
    minLength: 6,
    type: String,
  })
  @IsNotEmpty()
  @MinLength(6)
  repeatPassword: string;

  @ApiProperty({
    description: 'rol del usuario',
    type: String,
    enum: ['Developer', 'Employeer']
  })
  @IsEnum(['Developer', 'Employeer'])
  role: 'Developer' | 'Employeer';
}
