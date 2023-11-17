import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';


export class CreateCompanyDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    type: String,
  })
  @IsString()
  name: string;
 
  @ApiProperty({
    description: 'Email de contacto de la empresa',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Acerca de la empresa',
    example:
      'Somos una empresa de desarrollo de software que se especializa en el desarrollo de aplicaciones web y móviles.',
    type: String,
  })
  @IsOptional()
  @IsString()
  about: string;

  @ApiProperty({
    description: 'Direccion de la empresa',
    example: 'calle 123 # 123',
    type: String,
    required: false,
  })
  address?: string;

  @ApiProperty({
    description: 'Telefono de contacto de la empresa',
    type: String,
    example: '1234567890',
    required: false,
  })
  @IsString()
  telephone?: string;

  @ApiProperty({
    description: 'website de la empresa',
    type: String,
    example: 'https://www.linkedin.com/company/empresa',
    required: false,
  })
  @IsString()
  website?: string;

  @ApiProperty({
    description: 'linkedin de la empresa',
    type: String,
    example: 'https://www.linkedin.com/company/empresa',
    required: false,
  })
  @IsString()
  linkedin?: string;

  @ApiProperty({
    description: 'total de empleados de la empresa',
    type: String,
    example: '200',
    required: false,
  })
  @IsNumber()
  totalEmployes?: number;
}
