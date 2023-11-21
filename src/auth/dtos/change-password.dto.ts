import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ChangePaswwordDto {
    @ApiProperty({
        description: 'Old password',
        minLength: 6,
        example: '12345678',
        type: String,
        required: true,
    })
    @IsString()
    oldPassword: string;

    @ApiProperty({
        description: 'New password',
        minLength: 6,
        example: '12345678910',
        type: String,
        required: true,
    })
    @IsString()
    newPassword: string;
}