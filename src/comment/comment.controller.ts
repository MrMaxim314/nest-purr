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
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CommentGuard } from './guards/comment.guard';

@ApiTags('Comment')
@UseGuards(JwtGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({
    description: 'Method returns created comment',
  })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created',
  })
  @ApiResponse({ status: 500, description: 'Server error' })
  @HttpCode(201)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @ApiOperation({
    description: 'Method returns created column',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns list of comments',
  })
  @HttpCode(200)
  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @ApiOperation({
    description: 'Method returns one comment with given id',
  })
  @ApiResponse({ status: 200, description: 'Returns one comment' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @HttpCode(200)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @ApiOperation({
    description: 'Method updates existing comment',
  })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully updated',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @UseGuards(CommentGuard)
  @HttpCode(200)
  @Patch('/cards/:cardId/comments/:commentId')
  update(
    @Param('cardId') carId: string,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(carId, commentId, updateCommentDto);
  }

  @ApiOperation({
    description: 'Method removes comment by id',
  })
  @ApiResponse({
    status: 204,
    description: 'The comment has been successfully deleted',
  })
  @UseGuards(CommentGuard)
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
