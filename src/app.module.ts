import { Logger, Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TaskModule, forwardRef(() => TagsModule), AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
