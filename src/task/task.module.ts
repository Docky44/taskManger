import { Module, Logger, OnModuleInit, forwardRef } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './task.model';
import mongoose from 'mongoose';
import { TagsModule } from 'src/tags/tags.module';
import 'dotenv/config';

@Module({
  providers: [TaskService, Logger],
  imports: [
    MongooseModule.forRoot(process.env.DB),
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    forwardRef(() => TagsModule),
  ],
  controllers: [TaskController],
})
export class TaskModule implements OnModuleInit {
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
