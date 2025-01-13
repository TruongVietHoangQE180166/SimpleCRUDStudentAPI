import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true // This will auto-generate createdAt and updatedAt fields
})
export class Student extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  birthday: Date;

  @Prop({ required: true, unique: true })
  id: number;

  
}

export const StudentSchema = SchemaFactory.createForClass(Student);