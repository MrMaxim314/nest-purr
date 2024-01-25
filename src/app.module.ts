import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ColumnModule } from './column/column.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [PrismaModule, AuthModule, ColumnModule, CommentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
