import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/reate-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('create')
  create(@Body() createStudentDto: CreateStudentDto) {
    return {
      method: 'CREATE',
      data: this.studentService.create(createStudentDto)
    };
  }

  
@Get('list') 
findAll(@Query('page') page: number, @Query('limit') limit: number) {
  try {
    
    if (!page || !limit) {
      throw new Error('Page and limit are required');
    }

    const result = this.studentService.findAll(+page, +limit);
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
  findOne(@Param('id') id: string) {
    return {
      method: 'GET_ONE',
      data: this.studentService.findOne(+id)
    };
  }

  @Post('update/:id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return {
      method: 'UPDATE',
      data: this.studentService.update(+id, updateStudentDto)
    };
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return {
      method: 'DELETE',
      data: this.studentService.remove(+id)
    };
  }
}