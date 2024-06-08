import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task } from './task.model';
import { TagsService } from 'src/tags/tags.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    @Inject(forwardRef(() => TagsService))
    private readonly tagsService: TagsService,
  ) {}

  async createTask(
    title: string,
    description: string,
    tags: Types.ObjectId[],
  ): Promise<Task> {
    const newTask = new this.taskModel({ title, description, tags });
    return newTask.save();
  }

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  async findById(id: string): Promise<Task> {
    return this.taskModel.findById(id).exec();
  }

  async deleteTask(id: string): Promise<boolean> {
    const deleteTask = await this.taskModel.findByIdAndDelete(id).exec();
    if (!deleteTask) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return true;
  }

  async updateTask(id: string, updateData: Partial<Task>): Promise<Task> {
    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!updatedTask) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return updatedTask;
  }

  async getAllTasks(): Promise<Task[]> {
    return this.taskModel.find().populate('subTasks').exec();
  }

  async createSubTask(
    parentId: string,
    title: string,
    description: string,
    tags: Types.ObjectId[],
  ): Promise<Task> {
    const parentTask = await this.taskModel.findById(parentId).exec();
    if (!parentTask) {
      throw new NotFoundException(`Parent task with id ${parentId} not found`);
    }

    const newSubTask = new this.taskModel({
      title,
      description,
      parentTask,
      tags,
    });
    await newSubTask.save();

    parentTask.subTasks.push(newSubTask);
    await parentTask.save();

    return newSubTask;
  }
}
