import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateDeveloperSkillDto {
    @ApiProperty({
        description: 'Id de la habilidad',
        type: String,
        required: false
    })
    @IsNumber()
    @IsOptional()
    skillId?: number;
    @ApiProperty({
        description: 'Nombre de la habilidad',
        type: String,
        example: 'Javascript',
        required: false
    })
    @IsString()
    @IsOptional()
    skillName?: string
}