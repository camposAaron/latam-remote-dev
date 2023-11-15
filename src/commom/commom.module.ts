import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './services/CloudinaryService';
import { SkillController } from './skill/skill.controller';
import { SkillService } from './skill/skill.service';

@Global()
@Module({
  exports: [CloudinaryService],
  providers: [CloudinaryService, SkillService],
  controllers: [SkillController],
})
export class CommonModule {}
