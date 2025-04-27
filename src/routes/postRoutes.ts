import { Router } from 'express';

import PostController from '../controllers/postController';
import authMiddleware from '../middlewares/authMiddleware';
import uploadMiddleware from '../middlewares/uploadMiddleware';
import processImageMiddleware from '../middlewares/processImageMiddleware';

const router = Router();

// Route to create a new post
router.post('/', authMiddleware, uploadMiddleware, processImageMiddleware, PostController.createPost); //protect

// Route to get all posts with pagination
router.get('/', PostController.getAllPosts);

// Route to get a single post by ID
router.get('/:id', PostController.getPostById);

export default router;