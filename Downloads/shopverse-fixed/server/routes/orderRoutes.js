import express from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Create order
router.post('/', protect, asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, coupon, isTryBeforeBuy, isGroupBuy } = req.body;
  if (!items?.length) return res.status(400).json({ message: 'No items' });

  let itemsPrice = 0;
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) return res.status(404).json({ message: `Product ${item.product} not found` });
    const price = product.discountPrice || product.price;
    itemsPrice += price * item.qty;
    product.stock -= item.qty;
    product.sold += item.qty;
    await product.save();
  }

  const shippingPrice = itemsPrice > 499 ? 0 : 49;
  const taxPrice = Math.round(itemsPrice * 0.18);
  const couponDiscount = coupon?.discount || 0;
  const totalPrice = itemsPrice + shippingPrice + taxPrice - couponDiscount;
  const loyaltyPointsEarned = Math.floor(totalPrice / 10);

  const order = await Order.create({
    user: req.user._id, items, shippingAddress, paymentMethod,
    itemsPrice, shippingPrice, taxPrice, totalPrice,
    coupon, isTryBeforeBuy, isGroupBuy, loyaltyPointsEarned,
    tracking: [{ status: 'placed', description: 'Order placed successfully' }]
  });

  res.status(201).json(order);
}));

// Get my orders
router.get('/myorders', protect, asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
}));

// Get order by id
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email').populate('items.product', 'name images');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
}));

// Admin: get all orders
router.get('/', protect, admin, asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
}));

export default router;
