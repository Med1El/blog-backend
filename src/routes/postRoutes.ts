import { Router } from 'express';
import PostController from '../controllers/postController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();
const postController = new PostController();

// Route to create a new post
router.post('/', authMiddleware, postController.createPost); //protect

// Route to get all posts with pagination
router.get('/', postController.getAllPosts);

// Route to get a single post by ID
router.get('/:id', postController.getPostById);

export default router;