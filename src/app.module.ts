import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from './student/student.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Để ConfigModule có thể sử dụng ở mọi nơi trong ứng dụng
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/student-management', {
      autoIndex: true, // Tự động tạo index
    }),
    StudentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
