import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

// @GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const query = {};
  // Price drop filter
  if (req.query.priceDrop) {
    query.discountPrice = { $gt: 0, $lt: { $ifNull: ["$price", 0] } };
  }
  if (req.query.category) {
    const Category = (await import('../models/Category.js')).default;
    const cat = await Category.findOne({
      $or: [
        { slug: req.query.category.toLowerCase().replace(/\s+/g, '-') },
        { name: { $regex: new RegExp(req.query.category, 'i') } }
      ]
    });
    if (cat) query.category = cat._id;
    else query.category = null; // return empty intentionally
  }
  if (req.query.brand) query.brand = { $in: req.query.brand.split(',') };
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
  }
  if (req.query.rating) query.ratings = { $gte: Number(req.query.rating) };
  if (req.query.ecoScore) query.ecoScore = req.query.ecoScore;
  if (req.query.featured) query.isFeatured = true;
  if (req.query.flashSale) query.isFlashSale = true;
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { brand: { $regex: req.query.search, $options: 'i' } },
      { tags: { $in: [new RegExp(req.query.search, 'i')] } },
    ];
  }

  const sortMap = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { ratings: -1 },
    popular: { sold: -1 },
  };
  const sort = sortMap[req.query.sort] || { createdAt: -1 };


  // If priceDrop is requested, use custom filter
  let products, total;
  if (req.query.priceDrop) {
    products = await Product.find({
      ...query,
      $expr: { $and: [ { $gt: ["$price", 0] }, { $gt: ["$price", "$discountPrice"] }, { $gt: ["$stock", 0] } ] }
    })
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    total = await Product.countDocuments({
      ...query,
      $expr: { $and: [ { $gt: ["$price", 0] }, { $gt: ["$price", "$discountPrice"] }, { $gt: ["$stock", 0] } ] }
    });
  } else {
    [products, total] = await Promise.all([
      Product.find(query).populate('category', 'name slug').sort(sort).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);
  }

  res.json({ products, page, pages: Math.ceil(total / limit), total });
});

// @GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug').populate('reviews.user', 'name avatar');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// @GET /api/products/featured
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true }).populate('category', 'name slug').limit(12);
  res.json(products);
});

// @GET /api/products/flash-sale
export const getFlashSaleProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    isFlashSale: true,
    flashSaleEndsAt: { $gt: new Date() }
  }).populate('category', 'name slug').limit(8);
  res.json(products);
});

// @POST /api/products/:id/reviews
export const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (alreadyReviewed) return res.status(400).json({ message: 'Already reviewed' });

  product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
  product.updateRating();
  await product.save();
  res.status(201).json({ message: 'Review added' });
});

// @POST /api/products (admin/seller)
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({ ...req.body, seller: req.user._id });
  res.status(201).json(product);
});

// @PUT /api/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// @DELETE /api/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
});

// @GET /api/products/seed — dev only seeder
export const seedProducts = asyncHandler(async (req, res) => {
  res.json({ message: 'Use the seed script instead. See server/config/seed.js' });
});
