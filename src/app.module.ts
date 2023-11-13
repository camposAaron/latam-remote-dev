import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DeveloperModule } from './developer/developer.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DeveloperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
