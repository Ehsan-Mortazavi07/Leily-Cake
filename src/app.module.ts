import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './apps/users/users.module';
import { AuthModule } from './apps/auth/auth.module';
import { PostsModule } from './apps/posts/posts.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017/leily-cake'),UsersModule,AuthModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
