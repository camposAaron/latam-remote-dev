import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './services/CloudinaryService';

@Global()
@Module({
  exports: [CloudinaryService],
  providers: [CloudinaryService],
})
export class CommonModule {}
