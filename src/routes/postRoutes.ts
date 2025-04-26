import { Router } from 'express';
import PostController from '../controllers/postController';
import authMiddleware from '../middlewares/authMiddleware';
import upload from '../utils/file-upload';

const router = Router();

// Route to create a new post
router.post('/', authMiddleware, upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'extraSmallImages', maxCount: 4 },
]), PostController.createPost); //protect

// Route to get all posts with pagination
router.get('/', PostController.getAllPosts);

// Route to get a single post by ID
router.get('/:id', PostController.getPostById);

export default router;