import { IsEmail, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';

export class CreateStudentDto {
  @IsEmail({}, { message: 'Email is not in the correct format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsOptional() 
  @IsInt({ message: 'ID must be an integer' })
  @Min(1, { message: 'ID must be greater than 0' })
  id?: number;

  @IsInt({ message: 'Age must be an integer' })
  @Min(0, { message: 'Age cannot be less than 0' })
  @IsNotEmpty({ message: 'Age is required' })
  age: number;
}
