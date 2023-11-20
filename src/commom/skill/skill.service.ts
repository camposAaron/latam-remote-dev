import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSkillDto } from '../dto/create-skill-dto';

@Injectable()
export class SkillService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSkills(keyword: string) {
    const skills = await this.prismaService.skill.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        name: {
          contains: keyword,
          mode: 'insensitive',
        },
      },
      distinct: ['name'],
    });

    return skills;
  }

  async createSkill(dto: CreateSkillDto) {
    const createdSkills = [];

    for (const skillName of dto.skills) {
      const createdSkill = await this.prismaService.skill.create({
        data: {
          name: skillName,
        },
      });

      createdSkills.push(createdSkill);
    }

    return createdSkills;
  }
}
