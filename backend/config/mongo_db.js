import mongoose from 'mongoose';
import dotenv from 'dotenv';

// this line executes immediately when mongo_db.js is first imported since it is top levle
dotenv.config();

const connectMongoDB = async () => {
    // this code will not run immediately upon import. It will only run when 
    // explicitly called...
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${connection.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1);
    }
};
// makes this connectDB function available for other files to import. 
export default connectMongoDB;