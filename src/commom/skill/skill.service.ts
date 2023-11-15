import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
