import { PartialType } from '@nestjs/swagger';
import { CreatePostulationDto } from 'src/job-offer/dto/create-postulation.dto';

export class UpdatePostulatioDto extends PartialType(CreatePostulationDto) {}
