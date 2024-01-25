import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth-dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { USER_NOT_FOUND, WRONG_PASSWORD } from './auth-constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: AuthDto) {
    const newUser = await this.prismaService.user.create({
      data: {
        email: dto.login,
        password: await argon2.hash(dto.password),
      },
    });

    return newUser;
  }

  async login(dto: AuthDto) {
    const existedUser = await this.findUser(dto.login);

    if (!existedUser) {
      throw new UnauthorizedException(USER_NOT_FOUND);
    }

    const isPasswordMatch = await argon2.verify(
      existedUser.password,
      dto.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException(WRONG_PASSWORD);
    }

    return this.generateToken(existedUser.email);
  }

  async findUser(email: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async generateToken(email: string) {
    const payload = { email };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
