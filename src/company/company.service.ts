import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/commom/services/CloudinaryService';

@Injectable()
export class CompanyService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, file: Express.Multer.File) {

    const imageUrl = await this.cloudinaryService.upload(file);
    const company = await this.prismaService.company.create({
      data: {
        ...createCompanyDto,
        logo: imageUrl.secure_url
      }
    })

    return company;
  }

  findAll() {
    return `This action returns all company`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
