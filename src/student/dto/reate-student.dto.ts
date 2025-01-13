// dto/create-student.dto.ts
import { IsEmail, IsNotEmpty, IsInt, Min, IsString, IsDateString, Matches, MinLength } from 'class-validator';

export class CreateStudentDto {
  @IsEmail({}, { message: 'Email is not in the correct format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
  })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Please confirm your password' })
  repassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Birthday is required' })
  birthday: Date;

  @IsInt({ message: 'ID must be an integer' })
  @Min(1, { message: 'ID must be greater than 0' })
  @IsNotEmpty({ message: 'ID is required' })
  id: number;
}