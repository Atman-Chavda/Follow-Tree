import express from 'express';
import { signup, login, reset, logout, update } from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/reset', reset);
router.get('/logout', logout);
router.post('/update', update);
router.get('/reset/:token', (req, res) => {
    const { token } = req.params;
  res.json({ token });
});


export default router;