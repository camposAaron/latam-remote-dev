import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsString } from "class-validator";


export class CreateEducationDto {
  @ApiProperty({
    description: "Título de la educación",
    type: String,
    example: 'Ingeniero de sistemas'
  })
  @IsString()
  title: string;
  @ApiProperty({
    description: "Descripcion de la educación",
    type: String,
    example: 'Ingeniero de sistemas con 5 años de experiencia en el desarrollo de aplicaciones web y móviles.'
  })
  @IsString()
  description: string;
  @ApiProperty({
    description: "Fecha inicial",
    type: Date,
    example: '2021-01-01'
  })
  @IsDate()
  startDate: Date;
  @ApiProperty({
    description: "Fecha de culminacion",
    type: Date,
    example: '2021-09-01'
  })
  @IsDate()
  endDate: Date;
}
