import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface AuthenticatedRequest extends Request {
    userId?: string; // Add userId to the Request interface
}

const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1]; // Extract the token after "Bearer "

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        jwt.verify(token, JWT_SECRET, async (err, decoded: any) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }

            // Attach the user ID to the request object for later use
            req.userId = decoded.userId;

            // Optionally, you could fetch the user from the database here and attach the user object to the request:
            // const user = await User.findById(decoded.userId);
            // if (!user) {
            //   return res.status(401).json({ message: 'Unauthorized: User not found' });
            // }
            // req.user = user;

            next();
        });
    } catch (error: any) {
        res.status(401).json({ message: 'Unauthorized: Authentication failed', error: error.message });
    }
};

export default authMiddleware;