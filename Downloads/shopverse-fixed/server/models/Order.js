import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  price: Number,
  qty: Number,
  color: String,
  size: String,
});

const trackingSchema = new mongoose.Schema({
  status: String,
  description: String,
  timestamp: { type: Date, default: Date.now },
  location: String,
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: {
    street: String, city: String, state: String, pincode: String,
  },
  paymentMethod: { type: String, enum: ['razorpay', 'stripe', 'cod', 'wallet', 'upi'] },
  paymentResult: { id: String, status: String, update_time: String, email: String },
  itemsPrice: Number,
  shippingPrice: { type: Number, default: 0 },
  taxPrice: { type: Number, default: 0 },
  totalPrice: Number,
  coupon: { code: String, discount: Number },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'packed', 'shipped', 'out-for-delivery', 'delivered', 'cancelled', 'returned'],
    default: 'placed',
  },
  tracking: [trackingSchema],
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  isDelivered: { type: Boolean, default: false },
  deliveredAt: Date,
  isGroupBuy: { type: Boolean, default: false },
  isTryBeforeBuy: { type: Boolean, default: false },
  loyaltyPointsEarned: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
