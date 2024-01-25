import { PartialType } from '@nestjs/swagger';
import { CreateColumnDto } from './create-column.dto';
import { IsString } from 'class-validator';

export class UpdateColumnDto extends PartialType(CreateColumnDto) {
  @IsString()
  title: string;

  @IsString()
  columnId: string;
}
