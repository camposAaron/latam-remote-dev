import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IGrantedAccess } from './interfaces/Igranted-access';
import { AuthDto, RegisterDto } from './dtos';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async getMyInfo(userId: number): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new BadRequestException('No estas logueado');
    }

    return user;
  }

  async updateUserPhopo(userId: number, photoUrl: string) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        pictureUrl: photoUrl,
      },
    });

    const { password, ...rest } = user;

    return rest;
  }

  async login(authDto: AuthDto): Promise<IGrantedAccess> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: authDto.email,
      },
      include: {
        company: true,
        Developer: {
          include: {
            DeveloperSkill: {
              select: {
                id: true,
                skill: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            Education: true,
            JobExperience: true,
            Postulation: {
              select: {
                jobOfferId: true
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Usuario o contraseña incorrectos');
    }

    const passwordMatch = await argon.verify(user.password, authDto.password);

    if (!passwordMatch) {
      throw new BadRequestException('Usuario o contraseña incorrectos');
    }

    const token = await this.signToken(user.id, user.email);

    let response: IGrantedAccess = {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        photoUrl: user.pictureUrl,
      },
    };

    if (user.role === 'Developer') {
      response = {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          photoUrl: user.pictureUrl,
          developer: user.Developer,
        },
      };
    } else if (user.role === 'Employeer') {
      response = {
        token,
        user: {
          id: user.id,
          email: user.email,
          photoUrl: user.pictureUrl,
          role: user.role,
          company: user.company,
        },
      };
    }

    return response;
  }

  async register(registerDto: RegisterDto): Promise<IGrantedAccess> {
    if (registerDto.password !== registerDto.repeatPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const hashedPassword = await argon.hash(registerDto.password);

    const newUser = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        role: registerDto.role,
      },
    });
    const token = await this.signToken(newUser.id, newUser.email);

    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }

  async signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get('JWT_EXPIRATION'),
      secret: secret,
    });

    return token;
  }
}

function getAvatarUrl(name: string, lastName: string) {
  return `https://ui-avatars.com/api/?name=${name}+${lastName}&background=random&length=1&size=524`;
}
