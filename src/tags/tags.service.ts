import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tags } from './tags.model';
import { Model } from 'mongoose';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tags.name) private readonly tagsModel: Model<Tags>,
  ) {}

  async findAll(): Promise<Tags[]> {
    return this.tagsModel.find().exec();
  }

  async createTag(name: string): Promise<Tags> {
    const newTag = new this.tagsModel({ name });
    return newTag.save();
  }

  async deleteTag(id: string): Promise<boolean> {
    const deleteTag = await this.tagsModel.findByIdAndDelete(id).exec();
    if (!deleteTag) {
      throw new NotFoundException(`Tags with id ${id} not found`);
    }
    return true;
  }

  async updateTag(id: string, updateData: Partial<Tags>): Promise<Tags> {
    const updatedTag = await this.tagsModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!updatedTag) {
      throw new NotFoundException(`Tags with id ${id} not found`);
    }
    return updatedTag;
  }
}
