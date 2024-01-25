import { Module } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [ColumnController],
  providers: [ColumnService],
  imports: [AuthService],
})
export class ColumnModule {}
