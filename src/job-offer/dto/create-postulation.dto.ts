import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsEnum, IsNumber } from 'class-validator';

export class CreatePostulationDto {
  @ApiProperty({
    description: 'Date of postulation',
    type: Date,
    example: '2021-10-10',
    required: true,
  })
  @IsDateString()
  postulationDate: Date;

  @ApiProperty({
    description: 'Estado de la postulacion',
    type: String,
    default: 'Pending',
    example: 'Pending',
    enum: ['Pending', 'Accepted', 'Rejected'],
  })
  @IsEnum(['Pending', 'Accepted', 'Rejected'])
  state: 'Pending' | 'Accepted' | 'Rejected';

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
