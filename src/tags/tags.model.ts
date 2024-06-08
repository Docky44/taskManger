import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Tags extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description: string;
}

export const TagsSchema = SchemaFactory.createForClass(Tags);
