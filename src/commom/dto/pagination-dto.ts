import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    type: Number,
    description: 'Numero de pagina',
    example: 1,
    required: true
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;
}