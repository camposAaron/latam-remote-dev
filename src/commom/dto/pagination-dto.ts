import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    type: Number,
    description: 'Numero de elementos que quieres que se muestren',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(10)
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    type: Number,
    example: 0,
    default: 100,
    description:
      'Numero de elementos que quieres que se salten desde el inicio',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}