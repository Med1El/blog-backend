import express from 'express';
import cors from 'cors';

import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import errorHandler2 from './middlewares/errorHandlerV2';


const app = express();
const PORT = process.env.PORT || 5000;

connectDB().then(() => {

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });

})


app.use(cors())
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);


app.use(errorHandler2);

app.use(express.static('uploads'));
