import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  UseGuards,
  Request
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/reate-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('register')
  async register(@Body() createStudentDto: CreateStudentDto) {
    try {
      const data = await this.studentService.register(createStudentDto);
      return {
        method: 'REGISTER',
        data
      };
    } catch (error) {
      throw new BadRequestException({
        method: 'REGISTER',
        error: {
          status: 400,
          message: error.message
        }
      });
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const data = await this.studentService.login(loginDto);
      return {
        method: 'LOGIN',
        data
      };
    } catch (error) {
      throw new BadRequestException({
        method: 'LOGIN',
        error: {
          status: 400,
          message: error.message
        }
      });
    }
  }

  @Get('list')
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    try {
      if (!page || !limit) {
        throw new Error('Page and limit are required');
      }

      const result = await this.studentService.findAll(+page, +limit);
      return {
        method: 'GET_ALL',
        data: result,
      };
    } catch (error) {
      throw new BadRequestException({
        method: 'GET_ALL',
        error: {
          status: 400,
          message: error.message,
        },
      });
    }
  }

  @Get('detail/:id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.studentService.findOne(+id);
      return {
        method: 'GET_ONE',
        data
      };
    } catch (error) {
      throw new BadRequestException({
        method: 'GET_ONE',
        error: {
          status: 400,
          message: error.message
        }
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('update/:id')
  async update(
    @Param('id') id: string, 
    @Body() updateStudentDto: UpdateStudentDto,
    @Request() req
  ) {
    try {
      const data = await this.studentService.update(+id, updateStudentDto, req.user.id);
      return {
        method: 'UPDATE',
        data
      };
    } catch (error) {
      throw new BadRequestException({
        method: 'UPDATE',
        error: {
          status: 400,
          message: error.message
        }
      });
    }
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  async remove(@Param('id') id: string, @Request() req) {
    try {
      await this.studentService.remove(+id, req.user.id);
      return {
        method: 'DELETE',
        data: { message: `Student with ID ${id} deleted successfully` }
      };
    } catch (error) {
      throw new BadRequestException({
        method: 'DELETE',
        error: {
          status: 400,
          message: error.message
        }
      });
    }
  }
}