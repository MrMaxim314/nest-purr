import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ColumnGuard } from './guards/column.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Column')
@UseGuards(JwtGuard)
@Controller('column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @ApiOperation({
    description: 'Method returns created column',
  })
  @ApiResponse({
    status: 201,
    description: 'The column has been successfully created',
  })
  @ApiResponse({ status: 500, description: 'Server error' })
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() createColumnDto: CreateColumnDto) {
    return await this.columnService.create(createColumnDto);
  }

  @ApiOperation({
    description: 'Method returns list of columns',
  })
  @ApiResponse({ status: 200, description: 'Returns list of columns' })
  @HttpCode(200)
  @Get()
  findAll() {
    return this.columnService.findAll();
  }

  @ApiOperation({
    description: 'Method returns one column with given id',
  })
  @ApiResponse({ status: 200, description: 'Returns one column' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @HttpCode(200)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.columnService.findOne(id);
  }

  @ApiOperation({
    description: 'Method updates existing column',
  })
  @ApiResponse({
    status: 200,
    description: 'The column has been successfully updated',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @UseGuards(ColumnGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Patch(':columnId/cards/:cardId')
  update(
    @Param('columnId') columnId: string,
    @Param('cardId') cardId: string,
    @Body() updateColumnDto: UpdateColumnDto,
  ) {
    return this.columnService.update(columnId, cardId, updateColumnDto);
  }

  @ApiOperation({
    description: 'Method removes column by id',
  })
  @ApiResponse({
    status: 204,
    description: 'The column has been successfully deleted',
  })
  @UseGuards(ColumnGuard)
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.columnService.remove(id);
  }
}
