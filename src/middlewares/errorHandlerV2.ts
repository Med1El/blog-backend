// errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { errorResponse } from '../utils/responses';
import AppError from '../utils/AppError';



const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const errors = (err as any).errors || [];

    // Log error
    logger.error({
        message: message,
        stack: err.stack,
        statusCode,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
    });

    errorResponse(res, statusCode, message, errors);
    // Avoid leaking stack trace in production
    //...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
};

export default errorHandler;
