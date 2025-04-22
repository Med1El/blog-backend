import { Request, Response } from 'express';
import Post from '../models/Post';

class PostController {
    async createPost(req: Request, res: Response) {
        try {
            const post = await Post.create(req.body);
            res.status(201).json({ success: true, data: post });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getAllPosts(req: Request, res: Response) {
        const { page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        try {
            const posts = await Post.find().skip(skip).limit(Number(limit));
            const totalPosts = await Post.countDocuments();
            res.status(200).json({
                success: true,
                data: posts,
                totalPosts,
                totalPages: Math.ceil(totalPosts / Number(limit)),
                currentPage: Number(page),
            });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getPostById(req: Request, res: Response) {
        try {
            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).json({ success: false, message: 'Post not found' });
            }
            res.status(200).json({ success: true, data: post });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

export default PostController;