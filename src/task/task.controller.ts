import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.model';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import { request } from 'express';

@Controller()
@ApiTags()
export class TaskController {
  private readonly logger = new Logger(TaskController.name);

  constructor(private readonly taskService: TaskService) {}

  @Get('/task')
  @ApiOperation({ summary: 'Get a new task' })
  async findAll(): Promise<Task[]> {
    this.logger.log('Requête GET /task reçue');

    const headers = request.headers;
    this.logger.log('En-têtes de la requête : ' + JSON.stringify(headers));

    const tasks = await this.taskService.findAll();
    return tasks;
  }

  @Post('/task')
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({ type: Task })
  async createTask(
    @Body()
    createTaskDto: {
      title: string;
      description: string;
      tags: Types.ObjectId[];
    },
  ): Promise<Task> {
    const { title, description, tags } = createTaskDto;
    return this.taskService.createTask(title, description, tags);
  }

  @Delete('/task/:id')
  @ApiOperation({ summary: 'Delete a task' })
  async deleteUser(@Param('id') id: string): Promise<void> {
    const deleted = await this.taskService.deleteTask(id);
    if (!deleted) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }

  @Patch('/task/:id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiBody({ type: Task })
  async updateTask(
    @Param('id') id: string,
    @Body() updateData: Partial<Task>,
  ): Promise<Task> {
    const updatedTask = await this.taskService.updateTask(id, updateData);
    return updatedTask;
  }

  @Post('/task/:parentId/task')
  @ApiOperation({ summary: 'Create a new sub task' })
  @ApiBody({ type: Task })
  async createSubTask(
    @Param('parentId') parentId: string,
    @Body()
    createSubTaskDto: {
      title: string;
      description: string;
      tags: Types.ObjectId[];
    },
  ): Promise<Task> {
    const { title, description, tags } = createSubTaskDto;
    return this.taskService.createSubTask(parentId, title, description, tags);
  }
}
