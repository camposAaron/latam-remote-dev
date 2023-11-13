import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateJobExperienceDto {
  @ApiProperty({
    description: 'Cargo',
    type: String,
    example: 'Desarrollador Full Stack',
  })
  @IsString()
  position: string;
  @ApiProperty({
    description: 'Nombre de la compañia',
    type: String,
    example: 'Google',
  })
  @IsString()
  companyName: string;
  @ApiProperty({
    description: 'Descripcion de la compañia',
    type: String,
    example: 'Google es una empresa multinacional estadounidense especializada en productos y servicios relacionados con Internet, software, dispositivos electrónicos y otras tecnologías.',
  })
  @IsString()
  description: string;
  @ApiProperty({
    description: 'Fecha de inicio de labores',
    type: Date,
    example: '2021-01-01',
  })
  @IsDate()
  startDate: Date;
  @ApiProperty({
    description: 'Fecha de culimacion de labores',
    type: Date,
    example: '2021-09-01',
  })
  @IsDate()
  endDate: Date;
  @ApiProperty({
    description: 'Direccion de la compañia',
    type: Date,
    example: 'Calle 123 # 123',
  })
  @IsString()
  location?: string;
  @ApiProperty({
    description: 'Id de la compañia',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  companyId?: string;
}
