import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './reate-student.dto';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {}
