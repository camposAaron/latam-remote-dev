import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/commom/services/CloudinaryService';
import { PaginateFunction, paginator } from 'src/commom/utils/pagination';

const paginate: PaginateFunction = paginator({ perPage: 10 });


@Injectable()
export class CompanyService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    file: Express.Multer.File,
    userId: number,
  ) {
    const imageUrl = await this.cloudinaryService.upload(file);
    const company = await this.prismaService.company.create({
      data: {
        ...createCompanyDto,
        logo: imageUrl.secure_url,
      },
    });

    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        companyId: company.id,
        role: 'Employeer',
      },
      include: {
        company: true,
      },
    });

    return user;
  }

  findAll() {
    return `This action returns all company`;
  }

  async findOne(id: number) {
    const company = await this.prismaService.company.findUnique({
      where: { id }
    })

    if(!company) throw { statusCode: 404, message: 'Company not found' }

    return company
  }

  async getJobOffers(userId: number, page: number) {
    
    const user = await this.prismaService.user.findUnique({
      where: { id: userId }
    })

    if(!user) throw { statusCode: 404, message: 'User not found' }

    return paginate(
      this.prismaService.jobOffer,
      {
        where: { companyId: user.companyId },
        include: {
          JobOfferSkill: {
            select: {
              id: true,
              skill: {
                select: {
                  id: true,
                  name: true,
                }
              }
            },
          }
        }
      },
      {
        page
      }
    )
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
