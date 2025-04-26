import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { successResponse } from '../utils/responses';
import AppError from '../utils/AppError';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });

    try {
        await user.save();
        successResponse(res, 201, 'User registered successfully');
    } catch (error: any) {
        next(error);
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            next(new AppError('Invalid credentials', 401));
        }

        const isMatch = await bcrypt.compare(password, user!.password);
        if (!isMatch) {
            next(new AppError('Invalid credentials', 401));
        }

        const token = jwt.sign({ id: user!._id }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
        successResponse(res, 200, 'Success', { 'token': token, 'username': user!.username, 'id': user!._id });
    } catch (error: any) {
        next(error);
    }
}


export default { register, login };