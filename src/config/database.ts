import mongoose from 'mongoose';
import process from 'process';
import errorHandlerV2 from '../middlewares/errorHandlerV2';
import logger from './logger';

const connectDB = async () => {
    try {
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useUnifiedTopology', true);
        mongoose.set('useCreateIndex', true);
        // mongoose.set('useFindAndModify', false);
        const conn = await mongoose.connect(process.env.MONGODB_URI as string);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(error);
    }
};

export default connectDB;