import { Logger, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.model';
import mongoose from 'mongoose';

@Module({
  providers: [UsersService, Logger],
  imports: [
    MongooseModule.forRoot(process.env.DB),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {
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
