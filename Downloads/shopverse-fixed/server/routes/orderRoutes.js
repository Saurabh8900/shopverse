import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Create order
router.post('/', protect, asyncHandler(async (req, res) => {
  const db = req.app.get('db');
  const { items, shippingAddress, paymentMethod } = req.body;
  if (!items?.length) return res.status(400).json({ message: 'No items' });

  let itemsPrice = 0;
  for (const item of items) {
    const product = db.prepare('SELECT price, countInStock FROM products WHERE id = ?').get(item.product);
    if (!product) return res.status(404).json({ message: `Product ${item.product} not found` });
    itemsPrice += product.price * item.qty;
    // Update stock
    db.prepare('UPDATE products SET countInStock = countInStock - ? WHERE id = ?').run(item.qty, item.product);
  }

  const shippingPrice = itemsPrice > 499 ? 0 : 49;
  const taxPrice = Math.round(itemsPrice * 0.18);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const result = db.prepare(`
    INSERT INTO orders (userId, orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, isPaid)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
  `).run(req.user.id, JSON.stringify(items), JSON.stringify(shippingAddress), paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice);

  res.status(201).json({ _id: result.lastInsertRowid, items, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice });
}));

// Get user orders
router.get('/myorders', protect, asyncHandler(async (req, res) => {
  const db = req.app.get('db');
  const orders = db.prepare('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC').all(req.user.id);
  res.json(orders.map(o => ({ ...o, orderItems: JSON.parse(o.orderItems), shippingAddress: JSON.parse(o.shippingAddress) })));
}));

// Get all orders (admin)
router.get('/', protect, admin, asyncHandler(async (req, res) => {
  const db = req.app.get('db');
  const orders = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all();
  res.json(orders.map(o => ({ ...o, orderItems: JSON.parse(o.orderItems), shippingAddress: JSON.parse(o.shippingAddress) })));
}));

// Get single order
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const db = req.app.get('db');
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ ...order, orderItems: JSON.parse(order.orderItems), shippingAddress: JSON.parse(order.shippingAddress) });
}));

// Update order to delivered
router.put('/:id/deliver', protect, admin, asyncHandler(async (req, res) => {
  const db = req.app.get('db');
  db.prepare('UPDATE orders SET isDelivered = 1, deliveredAt = CURRENT_TIMESTAMP WHERE id = ?').run(req.params.id);
  res.json({ message: 'Order delivered' });
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
