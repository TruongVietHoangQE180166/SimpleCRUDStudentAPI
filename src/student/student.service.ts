import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Student } from './interface/student.interface';
import { CreateStudentDto } from './dto/reate-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  private students: Student[] = [
    { id: 1, email: 'john.doe@example.com', name: 'John Doe', age: 20 },
    { id: 2, email: 'jane.smith@example.com', name: 'Jane Smith', age: 22 },
    { id: 3, email: 'alice.wonderland@example.com', name: 'Alice Wonderland', age: 21 },
  ];
  private idCounter = 4; 

  create(createStudentDto: CreateStudentDto): Student {
    const existingStudent1 = this.students.find(
      (student) => student.email === createStudentDto.email,
    );
    

    if (existingStudent1) {
      throw new BadRequestException('Student with this email already exists');
    }
    
    const existingStudent = this.students.find(
      (student) => student.id === createStudentDto.id,
    );

    if (existingStudent) {
      throw new BadRequestException('Student with this ID already exists');
    }


    const newStudent: Student = {
      id: this.idCounter++,
      ...createStudentDto,
    };

    this.students.push(newStudent);
    return newStudent;
  }

  findAll(page: number, limit: number): { data: Student[]; total: number } {
    if (!Number.isInteger(page) || page < 1) {
      throw new Error('Page must be a positive integer.');
    }
    if (!Number.isInteger(limit) || limit < 1) {
      throw new Error('Limit must be a positive integer.');
    }
  
    const start = (page - 1) * limit;
    const end = start + limit;
  
    return {
      data: this.students.slice(start, end),
      total: this.students.length,
    };
  }
  

  findOne(id: number): Student {
    if (!Number.isInteger(id) || id < 1) {
      throw new Error('ID must be a positive integer.');
    }
    const student = this.students.find((s) => s.id === id);
    if (!student) {
      throw new Error(`Student with ID ${id} not found.`);
    }
    return student;
  }

  update(id: number, updateStudentDto: UpdateStudentDto): Student {
    
    const student = this.students.find((student) => student.id === id);
    if (!student) {
      throw new BadRequestException(`Student with ID ${id} does not exist`);
    }
  
    
    if (
      updateStudentDto.email &&
      this.students.some(
        (s) => s.email === updateStudentDto.email && s.id !== id, 
      )
    ) {
      throw new BadRequestException('Student with this email already exists');
    }
  
    
    Object.assign(student, updateStudentDto);
  
    return student;
  }
  

  remove(id: number): void {
    const index = this.students.findIndex((student) => student.id === id);

    if (index === -1) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    this.students.splice(index, 1);
  }
}
