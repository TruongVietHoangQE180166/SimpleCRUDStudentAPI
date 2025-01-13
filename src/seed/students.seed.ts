import mongoose from 'mongoose';
import { StudentSchema } from '../student/student.schema';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();


dotenv.config();

async function seedDatabase() {
    // Kiểm tra biến môi trường DATABASE_URL
    if (!process.env.DATABASE_URL) {
        console.error('Error: DATABASE_URL is not defined in the environment variables.');
        process.exit(1);
    }

    
    await mongoose.connect(process.env.DATABASE_URL, {

    });

    const StudentModel = mongoose.model('Student', StudentSchema);

    console.log('Delete existing data in the "students" collection...');
    await StudentModel.deleteMany({}); // Xóa toàn bộ dữ liệu cũ

    console.log('Add new seed data to the "students" collection...');
    const students = [
        {
            email: 'hoangvc123456789@gmail.com',
            password: await bcrypt.hash('password1', 10), 
            name: 'hoangdeptrai',
            birthday: new Date('2000-01-01'),
            id: 1,
        },
        {
            email: 'CPT_NEMO@gmail.com',
            password: await bcrypt.hash('password2', 10), 
            name: 'xxx',
            birthday: new Date('1998-05-15'),
            id: 2,
        },
        
    ];

    await StudentModel.insertMany(students);

    console.log('Complete data seeding.');

    
    await mongoose.disconnect();
}


seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('error:', error);
        process.exit(1);
    });
