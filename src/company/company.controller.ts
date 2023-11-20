import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationPipe } from 'src/commom/pipes/validation.pipe';
import { GetUser } from 'src/auth/decorator/get-user-decorator';

@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        company: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            about: {
              type: 'string',
            },
            address: {
              type: 'string',
            },
            telephone: {
              type: 'string',
            },
            website: {
              type: 'string',
            },
            linkedin: {
              type: 'string',
            },
            totalEmployes: {
              type: 'number',
            },
          },
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File, @Body() body, @GetUser('id') id: number) {
    const companyDtoInstance = plainToClass(CreateCompanyDto, JSON.parse(body.company));

    // Validate the DTO instance
    const errors = await validate(companyDtoInstance);

    if (errors.length > 0) {
      // Handle validation errors (e.g., throw an exception or return an error response)
      console.log(errors);
    }

    return this.companyService.create(companyDtoInstance, file, id);
  }

  // @Get()
  // findAll() {
  //   return this.companyService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.companyService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
  //   return this.companyService.update(+id, updateCompanyDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.companyService.remove(+id);
  // }
}
