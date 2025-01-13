import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './student.schema';
import { CreateStudentDto } from './dto/reate-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>
  ) {}

  
  async register(createStudentDto: CreateStudentDto): Promise<Omit<Student, 'password'>> {
    // Validate password match
    if (createStudentDto.password !== createStudentDto.repassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check existing email
    const existingStudentEmail = await this.studentModel.findOne({ 
      email: createStudentDto.email 
    });

    if (existingStudentEmail) {
      throw new BadRequestException('Student with this email already exists');
    }

   
    const existingStudentId = await this.studentModel.findOne({ 
      id: createStudentDto.id 
    });
    
    if (existingStudentId) {
      throw new BadRequestException('Student with this ID already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);

    // Create new student
    const studentData = {
      ...createStudentDto,
      password: hashedPassword
    };
    delete studentData.repassword;

    const newStudent = new this.studentModel(studentData);
    const savedStudent = await newStudent.save();
    
    // Remove password from response
    const response = savedStudent.toObject();
    delete response.password;
    return response;
  }

  
  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const student = await this.studentModel.findOne({ email: loginDto.email });
    
    if (!student) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, student.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: student.id, email: student.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { token };
  }

  
  async update(
    studentId: number, 
    updateStudentDto: UpdateStudentDto, 
    currentUserId: number
  ): Promise<Student> {
    // Check if user is updating their own profile
    if (studentId !== currentUserId) {
      throw new UnauthorizedException('You can only update your own profile');
    }

    const student = await this.studentModel.findOne({ id: studentId });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // Check for email uniqueness if email is being updated
    if (updateStudentDto.email) {
      const existingStudent = await this.studentModel.findOne({
        email: updateStudentDto.email,
        id: { $ne: studentId }
      });

      if (existingStudent) {
        throw new BadRequestException('Student with this email already exists');
      }
    }

    // Hash password if it's being updated
    if (updateStudentDto.password) {
      if (updateStudentDto.password !== updateStudentDto.repassword) {
        throw new BadRequestException('Passwords do not match');
      }
      updateStudentDto.password = await bcrypt.hash(updateStudentDto.password, 10);
      delete updateStudentDto.repassword;
    }

    return await this.studentModel
      .findOneAndUpdate(
        { id: studentId }, 
        updateStudentDto,
        { new: true }
      )
      .exec();
  }

  
  async remove(studentId: number, currentUserId: number): Promise<void> {
    if (studentId !== currentUserId) {
      throw new UnauthorizedException('You can only delete your own account');
    }

    const result = await this.studentModel.deleteOne({ id: studentId }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }
  }

  
  async findAll(page: number, limit: number): Promise<{ data: Student[]; total: number }> {
    if (!Number.isInteger(page) || page < 1) {
      throw new BadRequestException('Page must be a positive integer');
    }
    if (!Number.isInteger(limit) || limit < 1) {
      throw new BadRequestException('Limit must be a positive integer');
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.studentModel.find()
        .select('-password') // Exclude password from response
        .skip(skip)
        .limit(limit)
        .exec(),
      this.studentModel.countDocuments()
    ]);

    return { data, total };
  }

  async findOne(id: number): Promise<Omit<Student, 'password'>> {
    if (!Number.isInteger(id) || id < 1) {
      throw new BadRequestException('ID must be a positive integer');
    }

    const student = await this.studentModel
      .findOne({ id })
      .select('-password') // Exclude password from response
      .exec();

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }
}