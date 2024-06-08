import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { TagsService } from './tags.service';
import { Tags, TagsSchema } from './tags.model';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { TagsController } from './tags.controller';

@Module({
  providers: [TagsService, Logger], // Ajoutez Logger ici
  imports: [
    MongooseModule.forRoot(process.env.DB),
    MongooseModule.forFeature([{ name: Tags.name, schema: TagsSchema }]),
  ],
  exports: [TagsService],
  controllers: [TagsController],
})
export class TagsModule implements OnModuleInit {
  constructor(private readonly logger: Logger) {}

  async onModuleInit() {
    try {
      await mongoose.connect(process.env.DB);
      this.logger.log('Connected to MongoDB Atlas');
    } catch (error) {
      this.logger.error('Failed to connect to MongoDB Atlas', error.stack);
    }
  }
}
