import {
  BadRequestException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CARD_NOT_FOUND, COLUMN_NOT_FOUND } from './column-constants';
import { AuthService } from 'src/auth/auth.service';
import { getUser } from 'src/helper/getUser';

@Injectable()
export class ColumnService {
  readonly context: ExecutionContext;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async create(createColumnDto: CreateColumnDto) {
    return await this.prismaService.column.create({
      data: {
        creatorId: (
          await this.authService.findUser(getUser(this.context).email)
        ).id,
      },
    });
  }

  async findAll() {
    return await this.prismaService.column.findMany();
  }

  async findOne(id: string) {
    return await this.prismaService.column.findFirst({
      where: {
        id: id,
      },
      include: {
        cards: true,
      },
    });
  }

  async update(
    columnId: string,
    cardId: string,
    updateColumnDto: UpdateColumnDto,
  ) {
    const column = await this.prismaService.column.findFirst({
      where: {
        id: columnId,
      },
    });

    if (!column) {
      throw new BadRequestException(COLUMN_NOT_FOUND);
    }

    const cardToUpdate = await this.prismaService.card.findFirst({
      where: {
        id: cardId,
      },
    });

    if (!cardToUpdate) {
      throw new BadRequestException(CARD_NOT_FOUND);
    }

    const card = await this.prismaService.card.update({
      where: {
        id: cardId,
      },
      data: {
        title: updateColumnDto.title ?? cardToUpdate.title,
        columnId: updateColumnDto.columnId ?? cardToUpdate.columnId,
      },
    });

    return card;
  }

  async remove(id: string) {
    return await this.prismaService.column.delete({
      where: {
        id,
      },
    });
  }
}
