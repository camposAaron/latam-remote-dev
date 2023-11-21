import { Injectable } from '@nestjs/common';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostulationDto } from './dto/create-postulation.dto';
import { PaginationDto } from 'src/commom/dto/pagination-dto';
import { FilterReservationDto } from './dto/filter-offers.dto';

@Injectable()
export class JobOfferService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createJobOfferDto: CreateJobOfferDto) {
    let skillsIds = [];
    let skillsNames = [];

    createJobOfferDto.OfferSkills.forEach(async (skill) => {
      if (skill.skillId) {
        skillsIds.push(skill.skillId);
      } else if (skill.skillName) {
        skillsNames.push(skill.skillName);
      }
    });

    let jobOfffer = await this.prismaService.jobOffer.create({
      data: {
        companyId: createJobOfferDto.companyId,
        description: createJobOfferDto.description,
        state: createJobOfferDto.state,
        title: createJobOfferDto.title,
        maxSalary: createJobOfferDto.maxSalary,
        minSalary: createJobOfferDto.minSalary,
        vacancies: createJobOfferDto.vacancies,
      },
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
      },
    });

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
    await this.prismaService.jobOfferSkill.createMany({
      data: skillsIds.map((skillId) => ({
        skillId,
        jobOfferId: jobOfffer.id,
      })),
    });

    jobOfffer = await this.prismaService.jobOffer.findUnique({
      where: { id: jobOfffer.id },
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
      },
    });

    return jobOfffer;
  }

  async findOffersPublic(
    pagination: PaginationDto,
    filter: FilterReservationDto,
  ) {
    const { limit = 10, offset = 0 } = pagination;

    const offers = await this.prismaService.jobOffer.findMany({
      take: limit,
      skip: offset,
      where: {
        OR: [
          {
            title: {
              contains: filter.search || '', // Use filter.searchText if available
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: filter.search || '',
              mode: 'insensitive',
            },
          },
          {
            company: {
              name: {
                contains: filter.search || '',
                mode: 'insensitive',
              },
            },
          },
        ],
        state: 'Opened',
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        company: true,
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
      },
    });

    // if (filter.skillsIds) {
    //  offers.filter((offer) => {
    //     for (let skill of offer.JobOfferSkill) {
    //       if (filter.skillsIds.includes(skill.skill.id)) {
    //         return true;
    //       }
    //     }
    //   });
    // }

    return {
      data: offers,
      total: offers.length,
    };
  }

  async findOne(id: number) {
    const offer = await this.prismaService.jobOffer.findUnique({
      where: {
        id,
      },
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
      },
    });

    return offer;
  }

  async update(id: number, updateJobOfferDto: UpdateJobOfferDto) {
    let skillsIds = [];
    let skillsName = [];

    if (updateJobOfferDto.OfferSkills) {
      await this.prismaService.jobOfferSkill.deleteMany({
        where: {
          jobOfferId: id,
        },
      });

      updateJobOfferDto.OfferSkills.forEach(async (skill) => {
        if (skill.skillId) {
          skillsIds.push(skill.skillId);
        } else if (skill.skillName) {
          skillsName.push(skill.skillName);
        }
      });
    }

    let jobOfffer = await this.prismaService.jobOffer.update({
      where: { id },
      data: {
        companyId: updateJobOfferDto.companyId,
        description: updateJobOfferDto.description,
        state: updateJobOfferDto.state,
        title: updateJobOfferDto.title,
        maxSalary: updateJobOfferDto.maxSalary,
        minSalary: updateJobOfferDto.minSalary,
        vacancies: updateJobOfferDto.vacancies,
      },
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
      },
    });

    if (skillsName.length > 0) {
      const createdSkill = await this.prismaService.$transaction(
        skillsName.map((skillName) =>
          this.prismaService.skill.create({ data: { name: skillName } }),
        ),
      );

      const skillsidsCreated = createdSkill.map((skill) => skill.id);

      skillsIds = skillsIds.concat(skillsidsCreated.map((id) => id));
    }

    await this.prismaService.jobOfferSkill.createMany({
      data: skillsIds.map((skillId) => ({
        skillId,
        jobOfferId: jobOfffer.id,
      })),
    });

    jobOfffer = await this.prismaService.jobOffer.findUnique({
      where: { id: jobOfffer.id },
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
      },
    });

    return jobOfffer;
  }

  remove(id: number) {
    return `This action removes a #${id} jobOffer`;
  }

  async createPostulation(
    postulationDto: CreatePostulationDto,
    userId: number,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (user.role !== 'Developer')
      throw { statusCode: 400, message: 'You are not a developer' };

    const postulation = await this.prismaService.postulation.create({
      data: {
        jobOfferId: postulationDto.jobOfferId,
        developerId: postulationDto.developerId,
        postulationDate: new Date(postulationDto.postulationDate),
        state: postulationDto.state,
      },
      include: {
        developer: true,
        jobOffer: {
          include: {
            company: true,
          }
        },
      },
    });

    return postulation;
  }
}