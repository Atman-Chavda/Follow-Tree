import express from 'express';
import { createPost} from '../controllers/postController.js';

const router = express.Router();

router.post('/createpost', createPost);

export default router;