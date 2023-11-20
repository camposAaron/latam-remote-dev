import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateSkillsOfferDto } from './create-skills-dto';

export class CreateJobOfferDto {
  @ApiProperty({
    description: 'Id de la compañia a la que pertenece la oferta de trabajo',
    type: Number,
    required: true
  })
  @IsNumber()
  companyId: number

  @ApiProperty({
    description: 'Titulo de la oferta de trabajo',
    type: String,
    required: true,
    example: "Desarrollador Full Stack"
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Descripcion de la oferta de trabajo',
    type: String,
    required: true,
    example: "Se necesita desarrollador Full Stack con 5 años de experiencia"
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Salario maximo de la oferta de trabajo',
    type: Number,
    required: false,
    example: 5000
  })
  @IsNumber()
  @IsOptional()
  maxSalary?: number;

  @ApiProperty({
    description: 'Salario minimo de la oferta de trabajo',
    type: Number,
    required: false,
    example: 1500
  })
  @IsNumber()
  @IsOptional()
  minSalary?: number;

  @ApiProperty({
    description: 'Estado de la oferta de trabajo',
    type: String,
    default:"Opened",
    example: "Opened",
    enum: ['Opened', 'Closed']
  })
  @IsEnum(['Opened', 'Closed'])
  state: 'Opened' | 'Closed';
  
  @ApiProperty({
    description: 'Cantidad de vacantes de la oferta',
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  vacancies?: number;


  @ApiProperty({
    description: 'Habilidades del desarrollador',
    type: [CreateSkillsOfferDto],
    required: true,
    example: [{skillId: 1},{ skillName: "Javascript"}]
  })
  @IsArray()
  OfferSkills: CreateSkillsOfferDto[];
}

