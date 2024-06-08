import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Exclude } from 'class-transformer';

@Schema()
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Exclude()
  @Prop({ type: Types.ObjectId, ref: 'Task', default: null })
  parentTask: Task;

  @Exclude()
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }], default: [] })
  subTasks: Task[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Tags' }], default: [] })
  tags: Types.ObjectId[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
