import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CreatePostulationDto } from 'src/job-offer/dto/create-postulation.dto';

export class UpdatePostulatioDto extends PartialType(CreatePostulationDto) {
    @ApiProperty({
        description: 'Estado de la postulacion',
        type: String,
        default: 'Pending',
        example: 'Pending',
        enum: ['Pending', 'Accepted', 'Rejected'],
      })
      @IsEnum(['Pending', 'Accepted', 'Rejected'])
      state: 'Pending' | 'Accepted' | 'Rejected';
}
