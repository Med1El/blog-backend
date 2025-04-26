import { NextFunction, Request, Response } from 'express';

import Post from '../models/Post';
import { successResponse } from '../utils/responses';
import AppError from '../utils/AppError';

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, content, tags, category, author } = req.body;
        let mainImage: string | undefined;
        let extraSmallImages: string[] = [];
        if (req.files && Object.keys(req.files).length > 0) {
            mainImage = (req.files as any)['mainImage'][0].filename;
            extraSmallImages = (req.files as any)['extraSmallImages']
                .reduce((acc: string[], obj: any) => {
                    acc.push(obj.filename);
                    return acc;
                }, []);
        } else {
            next(new AppError('No image(s) provided', 400));
        }
        const post = await Post.create({
            title,
            content,
            tags,
            category,
            author,
            'mainImage': mainImage,
            'extraSmallImages': extraSmallImages,
        });
        successResponse(res, 201, 'Success', post);
    } catch (error: any) {
        next(error);
    }
}

export const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    try {
        const posts = await Post.find().skip(skip).limit(Number(limit));
        const totalPosts = await Post.countDocuments();
        const data = {
            posts,
            totalPosts,
            totalPages: Math.ceil(totalPosts / Number(limit)),
            currentPage: Number(page),
        }
        successResponse(res, 200, 'Success', data);
    } catch (error: any) {
        next(error);
    }
}

export const getPostById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            next(new AppError('Post not found', 404));
        }
        successResponse(res, 200, 'Success', post)
    } catch (error: any) {
        next(error);
    }
}


export default { createPost, getAllPosts, getPostById };