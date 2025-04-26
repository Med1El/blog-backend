import { Response } from 'express';

export const successResponse = (res: Response, statusCode: number = 500, message: string = 'Success', data: any = {}) => {
    return res.status(statusCode).json({
        status: statusCode,
        message,
        data
    })
}

export const errorResponse = (res: Response, statusCode: number, message: string, errors: any[] = []) => {
    return res.status(statusCode).json({
        status: statusCode,
        message,
        errors
    })
} 
