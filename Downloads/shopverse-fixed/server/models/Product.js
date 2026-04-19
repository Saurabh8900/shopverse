import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  images: [String],
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  shortDesc: String,
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, default: 0 },
  images: [{ url: String, public_id: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String, required: true },
  stock: { type: Number, default: 0, min: 0 },
  sold: { type: Number, default: 0 },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [reviewSchema],
  tags: [String],
  colors: [{ name: String, hex: String, images: [String] }],
  sizes: [String],
  ecoScore: { type: String, enum: ['green', 'fair', 'high-impact'], default: 'fair' },
  isFeatured: { type: Boolean, default: false },
  isFlashSale: { type: Boolean, default: false },
  flashSaleEndsAt: Date,
  groupBuyThreshold: { type: Number, default: 3 },
  groupBuyDiscount: { type: Number, default: 10 },
  deliveryDays: { type: Number, default: 5 },
  returnDays: { type: Number, default: 30 },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Auto-generate slug
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  next();
});

// Update average rating
productSchema.methods.updateRating = function () {
  if (this.reviews.length === 0) { this.ratings = 0; this.numReviews = 0; return; }
  this.numReviews = this.reviews.length;
  this.ratings = this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
};

export default mongoose.model('Product', productSchema);
