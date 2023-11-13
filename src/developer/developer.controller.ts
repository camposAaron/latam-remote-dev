import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DeveloperService } from './developer.service';
import { CreateDeveloperDto } from './dto/create-developer-dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt';
import { GetUser } from 'src/auth/decorator/get-user-decorator';

@ApiTags('Developer')
@Controller('developer')
export class DeveloperController {
  constructor(private readonly developerService: DeveloperService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createDeveloperDto: CreateDeveloperDto, @GetUser('id') id: number) {
    return this.developerService.create(createDeveloperDto, id);
  }

  @Get()
  findAll() {
    return this.developerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.developerService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDeveloperDto: UpdateDeveloperDto) {
  //   return this.developerService.update(+id, updateDeveloperDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.developerService.remove(+id);
  }
}
