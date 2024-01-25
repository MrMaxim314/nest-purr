import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from './dto/auth-dto';
import { AuthService } from './auth.service';
import { USER_ALREADY_EXISTS } from './auth-constants';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    description: 'Method creates new user',
  })
  @ApiResponse({
    status: 201,
    description: 'New user has been successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const existedUser = await this.authService.findUser(dto.login);

    if (existedUser) {
      throw new BadRequestException(USER_ALREADY_EXISTS);
    }

    return this.authService.createUser(dto);
  }

  @ApiOperation({
    description: 'Method for user login',
  })
  @ApiResponse({
    status: 200,
    description: 'User token',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Body() dto: AuthDto) {
    return await this.authService.login(dto);
  }
}
