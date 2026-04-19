import express from 'express';
import { getProducts, getProductById, getFeaturedProducts, getFlashSaleProducts, addReview, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect, admin, seller } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/flash-sale', getFlashSaleProducts);
router.get('/:id', getProductById);
router.post('/:id/reviews', protect, addReview);
router.post('/', protect, seller, createProduct);
router.put('/:id', protect, seller, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
