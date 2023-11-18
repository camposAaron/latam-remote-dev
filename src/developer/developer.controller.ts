import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { DeveloperService } from './developer.service';
import { CreateDeveloperDto } from './dto/create-developer-dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt';
import { GetUser } from 'src/auth/decorator/get-user-decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/commom/services/CloudinaryService';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Developer')
@Controller('developer')
export class DeveloperController {
  constructor(
    private readonly developerService: DeveloperService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() createDeveloperDto: CreateDeveloperDto,
    @GetUser('id') id: number,
  ) {
    return this.developerService.create(createDeveloperDto, id);
  }

  // @Get()
  // findAll() {
  //   return this.developerService.findAll();
  // }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.developerService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateDeveloperDto: UpdateDeveloperDto,
  ) {
    return this.developerService.update(+id, updateDeveloperDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.developerService.remove(+id);
  // }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiParam({ name: 'developerId' })
  @ApiConsumes('multipart/form-data')
  @Post('upload-cv/:developerId')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadCv(
    @UploadedFile() file: Express.Multer.File,
    @Param('developerId') id: string,
  ) {
    const result = await this.cloudinaryService.upload(file);
    const response = await  this.developerService.updateCv(+id, result.secure_url);
    return response;
  }
}
