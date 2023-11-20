import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

export class CreateSkillDto {
    @ApiProperty({
        description: 'Crear skills',
        example: ["next", 'react'],
        required: true,
        type: [String]
    })
    @IsArray()
    skills: string[];
}