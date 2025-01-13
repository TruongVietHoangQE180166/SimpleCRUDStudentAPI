import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Verification extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  type: 'registration' | 'password-reset';

  @Prop({ required: true, expires: 900 }) 
  createdAt: Date;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);