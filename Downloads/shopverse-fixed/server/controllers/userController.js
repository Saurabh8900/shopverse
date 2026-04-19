import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'shopverse_secret_2024', { expiresIn: '7d' });

// @POST /api/users/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already registered' });
  const user = await User.create({ name, email, password });
  res.status(201).json({ ...user.toJSON(), token: generateToken(user._id) });
});

// @POST /api/users/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ ...user.toJSON(), token: generateToken(user._id) });
});

// @GET /api/users/profile
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name price images discountPrice').populate('cart.product', 'name price images stock');
  res.json(user);
});

// @PUT /api/users/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, phone, avatar, mood } = req.body;
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (avatar) user.avatar = avatar;
  if (mood !== undefined) user.mood = mood;
  await user.save();
  res.json(user.toJSON());
});

// @POST /api/users/wishlist/:productId
export const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const pid = req.params.productId;
  const idx = user.wishlist.indexOf(pid);
  if (idx > -1) user.wishlist.splice(idx, 1);
  else user.wishlist.push(pid);
  await user.save();
  res.json({ wishlist: user.wishlist, added: idx === -1 });
});

// @POST /api/users/cart
export const updateCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { productId, qty, color, size, action } = req.body;

  if (action === 'clear') { user.cart = []; }
  else if (action === 'remove') { user.cart = user.cart.filter(i => i.product.toString() !== productId); }
  else {
    const existing = user.cart.find(i => i.product.toString() === productId);
    if (existing) existing.qty = qty || existing.qty;
    else user.cart.push({ product: productId, qty: qty || 1, color, size });
  }

  await user.save();
  const populated = await User.findById(user._id).populate('cart.product', 'name price images stock discountPrice');
  res.json(populated.cart);
});
