import { Injectable } from '@nestjs/common';
import { CreateDeveloperDto } from './dto/create-developer-dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { UpdateDeveloperDto } from './dto/update-developer.dto';

@Injectable()
export class DeveloperService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createDeveloperDto: CreateDeveloperDto, userId: number) {
    const { DeveloperSkill, JobExperience, Education, ...rest } =
      createDeveloperDto;

    //first get the user that make the request
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (user.developerId && user.role !== 'Developer') {
      return new HttpErrorByCode[403](
        'You are not allowed to create a developer profile, you already have one',
      );
    }

    let skillsIds = [];
    let skillsNames = [];

    DeveloperSkill.forEach(async (skill) => {
      if (skill.skillId) {
        skillsIds.push(skill.skillId);
      } else if (skill.skillName) {
        skillsNames.push(skill.skillName);
      }
    });

    const developerData = {
      ...rest,
      Education: {
        createMany: {
          data: Education.map((education) => ({
            startDate: new Date(education.startDate),
            endDate: new Date(education.endDate),
            description: education.description,
            title: education.title,
          })),
        },
      },
      JobExperience: {
        createMany: {
          data: JobExperience.map((jobExperience) => ({
            location: jobExperience.location,
            description: jobExperience.description,
            startDate: new Date(jobExperience.startDate),
            endDate: new Date(jobExperience.endDate),
            position: jobExperience.position,
            companyName: jobExperience.companyName,
          })),
        },
      },
    };
    console.log(developerData);

    const developer = await this.prismaService.developer.create({
      data: developerData,
    });

    //add skills that not exist
    if (skillsNames.length > 0) {
      const createdSkill = await this.prismaService.$transaction(
        skillsNames.map((skillName) =>
          this.prismaService.skill.create({ data: { name: skillName } }),
        ),
      );

      const skillsidsCreated = createdSkill.map((skill) => skill.id);

      skillsIds = skillsIds.concat(skillsidsCreated.map((id) => id));
    }

    //conect skillIds to developerSkills
    await this.prismaService.developerSkill.createMany({
      data: skillsIds.map((skillId) => ({
        skillId,
        developerId: developer.id,
      })),
    });

    //associate developer created with the user that make the request
    const { password, ...userRest } = await this.prismaService.user.update({
      where: { id: userId },
      data: { developerId: developer.id },
    });

    return userRest;
  }

  findAll() {
    return `This action returns all developer`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} developer`;
  }

  async updateCv(id: number, cvUrl: string) {
    return this.prismaService.developer.update({
      where: { id },
      data: { cvUrl },
    });
  }

  async update(id: number, updateDeveloperDto: UpdateDeveloperDto) {
    const { DeveloperSkill, JobExperience, Education, ...rest } =
      updateDeveloperDto;

    let skillsIds = [];
    let skillsNames = [];

    DeveloperSkill.forEach(async (skill) => {
      if (skill.skillId) {
        skillsIds.push(skill.skillId);
      } else if (skill.skillName) {
        skillsNames.push(skill.skillName);
      }
    });

    const developer = await this.prismaService.developer.update({
      where: { id },
      data: {
        ...rest,
        Education: {
          updateMany: {
            where: { developerId: id },
            data: Education.map((education) => ({
              startDate: new Date(education.startDate),
              endDate: new Date(education.endDate),
              description: education.description,
              title: education.title,
            })),
          },
        },
        JobExperience: {
          updateMany: {
            where: { developerId: id },
            data: JobExperience.map((jobExperience) => ({
              location: jobExperience.location,
              description: jobExperience.description,
              startDate: new Date(jobExperience.startDate),
              endDate: new Date(jobExperience.endDate),
              position: jobExperience.position,
              companyName: jobExperience.companyName,
            })),
          },
        },
      },
    });

    //add skills that not exist
    if (skillsNames.length > 0) {
      const createdSkill = await this.prismaService.$transaction(
        skillsNames.map((skillName) =>
          this.prismaService.skill.create({ data: { name: skillName } }),
        ),
      );

      const skillsidsCreated = createdSkill.map((skill) => skill.id);

      skillsIds = skillsIds.concat(skillsidsCreated.map((id) => id));
    }

    //conect skillIds to developerSkills
    await this.prismaService.developerSkill.updateMany({
      where: { developerId: id },
      data: skillsIds.map((skillId) => ({
        skillId,
        developerId: developer.id,
      })),
    });

    return
  }

  remove(id: number) {
    return `This action removes a #${id} developer`;
  }
}