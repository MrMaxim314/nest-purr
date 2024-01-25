import {
  BadRequestException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CARD_NOT_FOUND } from 'src/column/column-constants';
import { COMMENT_NOT_FOUND } from './comment-constants';
import { AuthService } from 'src/auth/auth.service';
import { getUser } from 'src/helper/getUser';

@Injectable()
export class CommentService {
  readonly context: ExecutionContext;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    return await this.prismaService.comment.create({
      data: {
        text: createCommentDto.text,
        cardId: createCommentDto.cardId,
        authorId: (
          await this.authService.findUser(getUser(this.context).email)
        ).id,
      },
    });
  }

  async findAll() {
    return await this.prismaService.comment.findMany();
  }

  async findOne(id: string) {
    return await this.prismaService.comment.findFirst({
      where: {
        id,
      },
    });
  }

  async update(
    cardId: string,
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    const card = await this.prismaService.card.findUnique({
      where: {
        id: cardId,
      },
    });

    if (!card) {
      throw new BadRequestException(CARD_NOT_FOUND);
    }

    const commentToUpdate = await this.prismaService.comment.findFirst({
      where: {
        id: commentId,
      },
    });

    if (!commentToUpdate) {
      throw new BadRequestException(COMMENT_NOT_FOUND);
    }

    const comment = await this.prismaService.comment.update({
      where: {
        id: commentId,
      },
      data: {
        text: commentToUpdate.text ?? updateCommentDto.text,
      },
    });

    return comment;
  }

  async remove(id: string) {
    return await this.prismaService.comment.delete({
      where: {
        id,
      },
    });
  }
}
