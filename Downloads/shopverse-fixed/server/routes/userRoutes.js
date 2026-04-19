import express from 'express';
import { register, login, getProfile, updateProfile, toggleWishlist, updateCart } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/wishlist/:productId', protect, toggleWishlist);
router.post('/cart', protect, updateCart);

export default router;
