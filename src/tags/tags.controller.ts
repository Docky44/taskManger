import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { Tags } from './tags.model';

@Controller()
@ApiTags()
export class TagsController {
  private readonly logger = new Logger(TagsController.name);
  constructor(private readonly tagsService: TagsService) {}

  @Get('/tags')
  @ApiOperation({ summary: 'Get all tags' })
  async findAll(): Promise<Tags[]> {
    return await this.tagsService.findAll();
  }

  @Post('/tags')
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiBody({ type: Tags })
  async createTag(@Body() tag: Tags): Promise<Tags> {
    return this.tagsService.createTag(tag.name);
  }

  @Delete('/tags/:id')
  @ApiOperation({ summary: 'Delete a tag' })
  async deleteTag(@Param('id') id: string): Promise<void> {
    const deleted = await this.tagsService.deleteTag(id);
    if (!deleted) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }
  }

  @Patch('/tags/:id')
  @ApiOperation({ summary: 'Update a tag' })
  @ApiBody({ type: Tags })
  async updateTag(
    @Param('id') id: string,
    @Body() updateData: Partial<Tags>,
  ): Promise<Tags> {
    const updatedTag = await this.tagsService.updateTag(id, updateData);
    return updatedTag;
  }
}
