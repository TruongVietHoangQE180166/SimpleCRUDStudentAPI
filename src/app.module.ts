import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StudentModule } from './student/student.module';
import { Databaseconfig} from './config/database.config'; // Import DatabaseModule

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    Databaseconfig, 
    StudentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
