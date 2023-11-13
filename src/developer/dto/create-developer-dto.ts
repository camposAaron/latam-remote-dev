import { ApiProperty } from "@nestjs/swagger"
import { CreateDeveloperSkillDto } from "./create-developer-skill-dto"
import { CreateEducationDto } from "./create-education-dto"
import { CreateJobExperienceDto } from "./create-job-experience-dto"
import { IsArray, IsEmail, IsString } from "class-validator"

export class CreateDeveloperDto {
@ApiProperty({
    description: 'Nombre del usuario',
    type: String,
})
@IsString()
firstName: string
@ApiProperty({
    description: 'Apellido del usuario',
    type: String,
})
@IsString()
lastName: string
@ApiProperty({
    description: 'Titulo del usuario',
    example: 'Desarrollador Full Stack',
    type: String,
})
@IsString()
title: string
@ApiProperty({
    description: 'Acerca del usuario',
    example: 'Soy un desarrollador Full Stack con 5 años de experiencia en el desarrollo de aplicaciones web y móviles.',
    type: String,
})
@IsString()
about: string
@ApiProperty({
    description: 'País del usuario',
    example: 'Colombia',
    type: String,
})
@IsString()
country: string
@ApiProperty({
    description: 'Ciudad del usuario',
    example: 'Bogotá',
    type: String,
})
@IsString()
city: string
@ApiProperty({
    description: 'Direccion del usuario',
    example: 'Bogotá',
    type: String,
})
@IsString()
address: string
@ApiProperty({
    description: 'Github del usuario',
    example: 'https://github.com/camposAaron',
    type: String,
})
@IsString()
github: string
@ApiProperty({
    description: 'Linkedin del usuario',
    example: 'https://www.linkedin.com/in/josu%C3%A9-aaron-campos-a585371a8/',
    type: String,
})
@IsString()
linkedin: string
@ApiProperty({
    description: 'Portafolio o pagina web del usuario',
    example: 'https://www.linkedin.com/in/josu%C3%A9-aaron-campos-a585371a8/',
    type: String,
})
@IsString()
website: string
@ApiProperty({
    description: 'Email de contacto del usuario',
    type: String,
})
@IsEmail()
email: string
@ApiProperty({
    description: 'Telefono de contacto del usuario',
    type: String,
})
@IsString()
telephone: string

@ApiProperty({
    description: 'Habilidades del desarrollador',
    type: [CreateDeveloperSkillDto]
})
@IsArray()
DeveloperSkill: CreateDeveloperSkillDto[]
@ApiProperty({
    description: 'Educacion del desarrollador',
    type: [CreateEducationDto]
})
@IsArray()
Education      :CreateEducationDto[]
@ApiProperty({
    description: 'Experiencia laboral del desarrollador',
    type: [CreateJobExperienceDto]
})
@IsArray()
JobExperience  :CreateJobExperienceDto[]

}
