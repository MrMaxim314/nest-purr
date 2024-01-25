import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ColumnGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const {
      user,
      params: { columnId },
    } = req;

    const { id } = await this.prismaService.user.findUnique({
      where: {
        email: user.email,
      },
    });

    const column = await this.prismaService.column.findUnique({
      where: {
        id: columnId,
      },
    });

    if (!column) {
      return false;
    }

    return id === column.creatorId;
  }
}
