import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsEnum, IsNumber } from 'class-validator';

export class CreatePostulationDto {

  @ApiProperty({
    description: 'Id del desarrollador que se postula',
    type: Number,
    required: true,
  })
  @IsNumber()
  developerId: number;

  @ApiProperty({
    description: 'Id de la oferta a postularse',
    type: Number,
    required: true,
  })
  @IsNumber()
  jobOfferId: number;
}
