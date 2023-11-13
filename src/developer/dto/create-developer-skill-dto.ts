import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateDeveloperSkillDto {
    @ApiProperty({
        description: 'Id de la habilidad',
        type: String,

    })
    @IsNumber()
    @IsOptional()
    skillId?: number;
    @ApiProperty({
        description: 'Nombre de la habilidad',
        type: String,
        example: 'Javascript'
    })
    @IsString()
    @IsOptional()
    skillName?: string 
    @ApiProperty({
        description: 'Años de experiencia',
        type: Number,
        example: 5
    })
    @IsNumber()
    @IsOptional()
    yearsOfExperience?: number;
}