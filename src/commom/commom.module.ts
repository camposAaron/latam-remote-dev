import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './services/CloudinaryService';
import { SkillController } from './skill/skill.controller';
import { SkillService } from './skill/skill.service';
import { ValidationPipe } from './pipes/validation.pipe';

@Global()
@Module({
  exports: [CloudinaryService],
  providers: [CloudinaryService, SkillService, ValidationPipe],
  controllers: [SkillController],
})
export class CommonModule {}
