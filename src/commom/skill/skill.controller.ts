import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt';
import { SkillService } from './skill.service';

@ApiTags('Skill')
@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiParam({ name: 'keyword', required: true })
  @Get(':keyword')
  getSkills(@Param('keyword') keyword: string) {
    return this.skillService.getSkills(keyword);
  }
}
