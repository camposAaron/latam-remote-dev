import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { JobOfferService } from './job-offer.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt';
import { GetUser } from 'src/auth/decorator/get-user-decorator';
import { CreatePostulationDto } from './dto/create-postulation.dto';
import { PaginationDto } from 'src/commom/dto/pagination-dto';
import { FilterReservationDto } from './dto/filter-offers.dto';

@ApiTags('Job Offer')
@Controller('job-offer')
export class JobOfferController {
  constructor(private readonly jobOfferService: JobOfferService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() createJobOfferDto: CreateJobOfferDto,
    @GetUser('role') role: string,
  ) {
    if (role !== 'Employeer')
      throw {
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          'You are not allowed to create a job offer, you are not a company',
      };
    return this.jobOfferService.create(createJobOfferDto);
  }

  @Get()
  findOffersPublic(
    @Query() pagination: PaginationDto,
    @Query() filter: FilterReservationDto,
  ) {
    if(filter.skillsIds?.length > 0){
      return this.jobOfferService.findOffersBySkillsIds(filter.skillsIds, pagination.page)
    }
    return this.jobOfferService.findOffersPublic(pagination.page, filter);
  }

  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobOfferService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobOfferDto: UpdateJobOfferDto,
    @GetUser('role') role: string,
  ) {
    if (role !== 'Employeer')
      throw {
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          'You are not allowed to create a job offer, you are not a company',
      };
    return this.jobOfferService.update(+id, updateJobOfferDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobOfferService.remove(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('/postulation')
  postular(
    @Body() createPostulationdto: CreatePostulationDto,
    @GetUser('id') id: number,
  ) {
    return this.jobOfferService.createPostulation(createPostulationdto, id);
  }

  
}
