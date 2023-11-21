import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDto, RegisterDto } from './dtos';
import { AuthService } from './auth.service';
import { GetUser } from './decorator/get-user-decorator';
import { JwtGuard } from './guard/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/commom/services/CloudinaryService';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cloudinaryService: CloudinaryService,
    ) {}


  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete('deleteAccount')
  deleteAccount(@GetUser('id') userId: number) {  
    return this.authService.deleteAccount(userId);
  }

  @Post('/login')
  async login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }


  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('/me')
  async getCurrentUserInfo(@GetUser('id', ParseIntPipe) id: number) {
    return this.authService.getMyInfo(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiConsumes('multipart/form-data')
  @Post('upload-user-pic/:userId')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        }
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadCv(
    @UploadedFile() file: Express.Multer.File,
    @Param('userId') id: string,
    @GetUser('id', ParseIntPipe) userId: number,
  ) {
    const result = await this.cloudinaryService.upload(file);
    const response = await  this.authService.updateUserPhopo(+id, result.secure_url);
    return response;
  }

}