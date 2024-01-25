import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const {
      user,
      params: { commentId },
    } = req;

    const { id } = await this.prismaService.user.findUnique({
      where: {
        email: user.email,
      },
    });

    const comment = await this.prismaService.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return false;
    }

    return id === comment.authorId;
  }
}
