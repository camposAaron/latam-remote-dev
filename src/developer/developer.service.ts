import { Injectable } from '@nestjs/common';
import { CreateDeveloperDto } from './dto/create-developer-dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { PaginateFunction, paginator } from 'src/commom/utils/pagination';

const paginate: PaginateFunction = paginator({ perPage: 10 });

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
            institution: education.institution,
            startDate: new Date(education.startDate),
            endDate: education.endDate ? new Date(education.endDate) : null,
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
            endDate: jobExperience.endDate
              ? new Date(jobExperience.endDate)
              : null,
            position: jobExperience.position,
            companyName: jobExperience.companyName,
          })),
        },
      },
    };

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
      include: {
        Developer: {
          include: {
            DeveloperSkill: {
              select: {
                id: true,
                skill: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            Education: {
              select: {
                id: true,
                institution: true,
                startDate: true,
                endDate: true,
                description: true,
                title: true,
              },
            },
            JobExperience: {
              select: {
                id: true,
                location: true,
                description: true,
                startDate: true,
                endDate: true,
                position: true,
                companyName: true,
              },
            },
          },
        },
      },
    });

    return userRest.Developer;
  }

  async findAllPostulationByUserDeveloper(userId: number, page: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (user.role !== 'Developer')
      throw { statusCode: 400, message: 'You are not a developer' };

    return paginate(this.prismaService.postulation, {
      where: {
        developerId: user.developerId,
      },
      include: {
        jobOffer: {
          include: {
            JobOfferSkill: {
              select: {
                id: true,
                skill: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            company: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const developer = await this.prismaService.developer.findUnique({
      where: { id },
      include: {
        DeveloperSkill: {
          select: {
            id: true,
            skill: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        Education: true,
        JobExperience: true,
      },
    });

    return developer;
  }

  async updateCv(id: number, cvUrl: string) {
    const developer = await this.prismaService.developer.findUnique({
      where: { id },
    });

    if (!developer) throw { statusCode: 404, message: 'Developer not found' };

    return this.prismaService.developer.update({
      where: { id },
      data: { cvUrl },
    });
  }

  async update(id: number, updateDeveloperDto: UpdateDeveloperDto) {
    const { DeveloperSkill, JobExperience, Education, ...rest } =
      updateDeveloperDto;

    const existDev = await this.prismaService.developer.findUnique({
      where: { id },
    });

    if (!existDev) throw { statusCode: 404, message: 'Developer not found' };

    let skillsIds = [];
    let skillsNames = [];

    DeveloperSkill.forEach(async (skill) => {
      if (skill.skillId) {
        skillsIds.push(skill.skillId);
      } else if (skill.skillName) {
        skillsNames.push(skill.skillName);
      }
    });

    await Promise.all([
      this.prismaService.education.deleteMany({
        where: { developerId: id },
      }),
      this.prismaService.jobExperience.deleteMany({
        where: { developerId: id },
      }),
      this.prismaService.developerSkill.deleteMany({
        where: { developerId: id },
      }),
    ]);

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
        developerId: id,
      })),
    });

    const developer = await this.prismaService.developer.update({
      where: { id },
      data: {
        ...rest,
        Education: {
          createMany: {
            data: Education.map((education) => ({
              institution: education.institution,
              startDate: new Date(education.startDate),
              endDate: education.endDate ? new Date(education.endDate) : null,
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
              endDate: jobExperience.endDate
                ? new Date(jobExperience.endDate)
                : null,
              position: jobExperience.position,
              companyName: jobExperience.companyName,
            })),
          },
        },
      },
      include: {
        DeveloperSkill: {
          select: {
            id: true,
            skill: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        Education: {
          select: {
            id: true,
            institution: true,
            startDate: true,
            endDate: true,
            description: true,
            title: true,
          },
        },
        JobExperience: {
          select: {
            id: true,
            location: true,
            description: true,
            startDate: true,
            endDate: true,
            position: true,
            companyName: true,
          },
        },
      },
    });

    return developer;
  }
}
