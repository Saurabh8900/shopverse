import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const categories = [
  { name: 'Electronics', slug: 'electronics', icon: '⚡', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', isFeatured: true },
  { name: 'Fashion', slug: 'fashion', icon: '👗', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', isFeatured: true },
  { name: 'Home & Living', slug: 'home-living', icon: '🏠', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', isFeatured: true },
  { name: 'Sports', slug: 'sports', icon: '🏃', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400', isFeatured: true },
  { name: 'Beauty', slug: 'beauty', icon: '💄', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', isFeatured: true },
  { name: 'Books', slug: 'books', icon: '📚', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', isFeatured: true },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shopverse');
  console.log('🌱 Seeding...');

  await Category.deleteMany({});
  await Product.deleteMany({});
  await User.deleteMany({});

  const createdCats = await Category.insertMany(categories);
  const catMap = Object.fromEntries(createdCats.map(c => [c.name, c._id]));

  const admin = await User.create({ name: 'Admin', email: 'admin@shopverse.com', password: 'admin123', role: 'admin' });

  // Merge all products into one array and insert at once
  const randomEco = () => ['green','fair','high-impact'][Math.floor(Math.random()*3)];
  const random = (min, max) => Math.floor(Math.random()*(max-min+1))+min;
  const randomRating = () => (Math.random() * 0.9 + 4).toFixed(1);
  const randomSold = () => random(100, 5000);
  const randomReviews = () => random(200, 8000);
  const delivery = () => random(1,5);
  const groupBuy = { groupBuyThreshold: 3, groupBuyDiscount: 10 };

  const allProducts = [
    // ELECTRONICS (8)
    { name: 'MacBook Air M3', brand: 'Apple', price: 114990, discountPrice: 104990, isFeatured: true, stock: 20, images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80' }], ...groupBuy, ...{
      slug: 'macbook-air-m3', description: 'Apple M3 chip, 13.6-inch Liquid Retina, ultra-lightweight.', shortDesc: 'Apple M3, 8GB, 256GB SSD', category: catMap['Electronics'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['laptop','apple','macbook'], }, },
    { name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', price: 124999, discountPrice: 109999, isFeatured: true, stock: 20, images: [{ url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80' }], ...groupBuy, ...{
      slug: 'samsung-galaxy-s24-ultra', description: '200MP camera, 6.8-inch AMOLED, S Pen included.', shortDesc: '12GB RAM, 256GB, Phantom Black', category: catMap['Electronics'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['smartphone','samsung','android'], }, },
    { name: 'OnePlus Buds Pro 2', brand: 'OnePlus', price: 9999, discountPrice: 6999, isFlashSale: true, stock: 20, images: [{ url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80' }], ...groupBuy, ...{
      slug: 'oneplus-buds-pro-2', description: 'ANC, dual drivers, 39hr battery, wireless charging.', shortDesc: 'Wireless ANC earbuds', category: catMap['Electronics'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['earbuds','oneplus','audio'], }, },
    { name: 'Dell XPS 15 Laptop', brand: 'Dell', price: 189990, discountPrice: 169990, stock: 20, images: [{ url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80' }], ...groupBuy, ...{
      slug: 'dell-xps-15-laptop', description: '15.6-inch 4K OLED, Intel i7, ultra-thin design.', shortDesc: 'i7, 16GB, 512GB SSD', category: catMap['Electronics'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['laptop','dell','xps'], }, },
    { name: 'GoPro Hero 12', brand: 'GoPro', price: 39990, discountPrice: 34990, stock: 20, images: [{ url: 'https://images.unsplash.com/photo-1502920917128-1aa500764bed?w=600&q=80' }], ...groupBuy, ...{
      slug: 'gopro-hero-12', description: '5.3K60 video, HyperSmooth 6.0, waterproof.', shortDesc: 'Action camera, 27MP', category: catMap['Electronics'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['camera','gopro','action'], }, },
    { name: 'iPad Pro 12.9"', brand: 'Apple', price: 109900, discountPrice: 99900, isFeatured: true, stock: 20, images: [{ url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80' }], ...groupBuy, ...{
      slug: 'ipad-pro-12-9', description: 'M2 chip, 12.9-inch Liquid Retina XDR, ProMotion.', shortDesc: 'M2, 128GB, Wi-Fi', category: catMap['Electronics'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['tablet','apple','ipad'], }, },
    { name: 'Bose QuietComfort 45', brand: 'Bose', price: 24990, discountPrice: 19990, isFlashSale: true, stock: 20, images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' }], ...groupBuy, ...{
      slug: 'bose-quietcomfort-45', description: 'World-class noise cancellation, 24hr battery.', shortDesc: 'Wireless headphones', category: catMap['Electronics'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['headphones','bose','audio'], }, },
    { name: 'LG 27" 4K Monitor', brand: 'LG', price: 45990, discountPrice: 38990, stock: 20, images: [{ url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80' }], ...groupBuy, ...{
      slug: 'lg-27-4k-monitor', description: '27-inch UHD, IPS, HDR10, USB-C.', shortDesc: '4K, 60Hz, 99% sRGB', category: catMap['Electronics'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['monitor','lg','display'], }, },
    // MENS FASHION (6)
    { name: 'Allen Solly Slim Fit Shirt', brand: 'Allen Solly', price: 2499, discountPrice: 1299, stock: 20, sizes: ['S','M','L','XL','XXL'], colors: [
      { name: 'White', hex: '#ffffff' },
      { name: 'Blue', hex: '#3b82f6' },
      { name: 'Black', hex: '#1a1a1a' }
    ], images: [{ url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80' }], ...groupBuy, ...{
      slug: 'allen-solly-slim-fit-shirt', description: 'Cotton, slim fit, formal/casual.', shortDesc: 'Men’s slim fit shirt', category: catMap['Fashion'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['shirt','allen solly','mens'], }, },
    { name: 'Van Heusen Formal Trousers', brand: 'Van Heusen', price: 3499, discountPrice: 1999, stock: 20, sizes: ['30','32','34','36'], images: [{ url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80' }], ...groupBuy, ...{
      slug: 'van-heusen-formal-trousers', description: 'Poly-viscose, wrinkle-free, slim fit.', shortDesc: 'Formal trousers', category: catMap['Fashion'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['trousers','van heusen','mens'], }, },
    { name: 'US Polo Assn T-Shirt Pack', brand: 'US Polo', price: 1999, discountPrice: 999, isFlashSale: true, stock: 20, sizes: ['S','M','L','XL'], images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80' }], ...groupBuy, ...{
      slug: 'us-polo-tshirt-pack', description: 'Pack of 2, 100% cotton, crew neck.', shortDesc: 'T-shirt pack', category: catMap['Fashion'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['tshirt','us polo','mens'], }, },
    { name: 'Peter England Blazer', brand: 'Peter England', price: 7999, discountPrice: 4999, stock: 20, sizes: ['38','40','42','44'], colors: [
      { name: 'Navy', hex: '#1e3a5f' },
      { name: 'Charcoal', hex: '#374151' },
      { name: 'Black', hex: '#1a1a1a' }
    ], images: [{ url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80' }], ...groupBuy, ...{
      slug: 'peter-england-blazer', description: 'Single-breasted, wool blend, formal.', shortDesc: 'Men’s blazer', category: catMap['Fashion'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['blazer','peter england','mens'], }, },
    { name: 'Woodland Trekking Shoes', brand: 'Woodland', price: 4999, discountPrice: 3499, stock: 20, sizes: ['7','8','9','10','11'], images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' }], ...groupBuy, ...{
      slug: 'woodland-trekking-shoes', description: 'Leather, rugged sole, outdoor.', shortDesc: 'Trekking shoes', category: catMap['Fashion'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['shoes','woodland','mens'], }, },
    { name: 'Flying Machine Denim Jacket', brand: 'Flying Machine', price: 3999, discountPrice: 2499, stock: 20, sizes: ['S','M','L','XL'], colors: [
      { name: 'Indigo', hex: '#3d5a80' },
      { name: 'Black', hex: '#1a1a1a' }
    ], images: [{ url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80' }], ...groupBuy, ...{
      slug: 'flying-machine-denim-jacket', description: 'Denim, button closure, casual.', shortDesc: 'Denim jacket', category: catMap['Fashion'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['jacket','flying machine','mens'], }, },
    // WOMENS FASHION (6)
    { name: 'Biba Anarkali Kurta', brand: 'Biba', price: 2499, discountPrice: 1499, stock: 20, sizes: ['XS','S','M','L','XL'], colors: [
      { name: 'Pink', hex: '#f9a8d4' },
      { name: 'Blue', hex: '#93c5fd' },
      { name: 'Yellow', hex: '#fde68a' }
    ], images: [{ url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=600&q=80' }], ...groupBuy, ...{
      slug: 'biba-anarkali-kurta', description: 'Cotton, flared, ethnic wear.', shortDesc: 'Anarkali kurta', category: catMap['Fashion'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['kurta','biba','womens'], }, },
    { name: 'W Brand Palazzo Set', brand: 'W', price: 3499, discountPrice: 1999, stock: 20, sizes: ['XS','S','M','L'], colors: [
      { name: 'Maroon', hex: '#800000' },
      { name: 'Green', hex: '#22c55e' }
    ], images: [{ url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=600&q=80' }], ...groupBuy, ...{
      slug: 'w-brand-palazzo-set', description: 'Rayon, printed, 2-piece set.', shortDesc: 'Palazzo set', category: catMap['Fashion'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['palazzo','w brand','womens'], }, },
    { name: 'Vero Moda Party Dress', brand: 'Vero Moda', price: 4999, discountPrice: 2999, isFeatured: true, stock: 20, sizes: ['XS','S','M','L'], colors: [
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'Red', hex: '#e63946' },
      { name: 'Royal Blue', hex: '#1d4ed8' }
    ], images: [{ url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80' }], ...groupBuy, ...{
      slug: 'vero-moda-party-dress', description: 'Sequin, bodycon, party wear.', shortDesc: 'Party dress', category: catMap['Fashion'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['dress','vero moda','womens','party'], }, },
    { name: 'H&M Basic Tee 3-Pack', brand: 'H&M', price: 1499, discountPrice: 999, isFlashSale: true, stock: 20, sizes: ['XS','S','M','L','XL'], colors: [
      { name: 'White', hex: '#ffffff' },
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'Grey', hex: '#6b7280' }
    ], images: [{ url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80' }], ...groupBuy, ...{
      slug: 'hm-basic-tee-3pack', description: 'Pack of 3, cotton, crew neck.', shortDesc: 'Basic tee pack', category: catMap['Fashion'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['tshirt','h&m','womens'], }, },
    { name: 'Mango Floral Midi Dress', brand: 'Mango', price: 5999, discountPrice: 3999, stock: 20, sizes: ['XS','S','M','L'], colors: [
      { name: 'Floral Blue', hex: '#bfdbfe' },
      { name: 'Floral Pink', hex: '#fbcfe8' }
    ], images: [{ url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80' }], ...groupBuy, ...{
      slug: 'mango-floral-midi-dress', description: 'Floral print, midi length, summer.', shortDesc: 'Floral midi dress', category: catMap['Fashion'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['dress','mango','womens'], }, },
    { name: 'Puma Women\'s Sneakers', brand: 'Puma', price: 6999, discountPrice: 4999, stock: 20, sizes: ['4','5','6','7','8'], colors: [
      { name: 'White', hex: '#ffffff' },
      { name: 'Pink', hex: '#f9a8d4' },
      { name: 'Black', hex: '#1a1a1a' }
    ], images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' }], ...groupBuy, ...{
      slug: 'puma-womens-sneakers', description: 'Mesh upper, lightweight, casual.', shortDesc: 'Women’s sneakers', category: catMap['Fashion'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['sneakers','puma','womens'], }, },

    // --- NEW PRODUCTS ---
    // Electronics
    { name: 'Sony WH-1000XM5', brand: 'Sony', price: 29999, discountPrice: 24999, isFeatured: true, stock: 20, images: [{ url: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=600&q=80' }], ...groupBuy, ...{
      slug: 'sony-wh-1000xm5', description: 'Industry-leading noise cancellation, 30hr battery.', shortDesc: 'Wireless headphones', category: catMap['Electronics'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['headphones','sony','audio'], }, },
    { name: 'Fitbit Versa 4', brand: 'Fitbit', price: 18999, discountPrice: 14999, stock: 20, images: [{ url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80' }], ...groupBuy, ...{
      slug: 'fitbit-versa-4', description: 'Fitness tracker, heart rate, sleep monitor.', shortDesc: 'Smartwatch', category: catMap['Electronics'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['smartwatch','fitbit','wearable'], }, },

    // Fashion
    { name: 'Levi’s 511 Slim Jeans', brand: 'Levi’s', price: 3999, discountPrice: 2999, stock: 20, sizes: ['30','32','34','36','38'], colors: [
      { name: 'Blue', hex: '#2563eb' },
      { name: 'Black', hex: '#1a1a1a' }
    ], images: [{ url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80' }], ...groupBuy, ...{
      slug: 'levis-511-slim-jeans', description: 'Slim fit, stretch denim.', shortDesc: 'Men’s jeans', category: catMap['Fashion'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['jeans','levis','mens'], }, },
    { name: 'Zara Summer Dress', brand: 'Zara', price: 3499, discountPrice: 2499, stock: 20, sizes: ['XS','S','M','L','XL'], colors: [
      { name: 'Yellow', hex: '#fde047' },
      { name: 'Green', hex: '#22c55e' }
    ], images: [{ url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80' }], ...groupBuy, ...{
      slug: 'zara-summer-dress', description: 'Lightweight, floral print, summer style.', shortDesc: 'Women’s dress', category: catMap['Fashion'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['dress','zara','womens'], }, },

    // Home & Living
    { name: 'Philips Air Fryer', brand: 'Philips', price: 12999, discountPrice: 9999, stock: 20, images: [{ url: 'https://images.unsplash.com/photo-1506368083636-6defb67639d0?w=600&q=80' }], ...groupBuy, ...{
      slug: 'philips-air-fryer', description: 'Rapid air technology, low oil cooking.', shortDesc: 'Air fryer', category: catMap['Home & Living'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['appliance','philips','kitchen'], }, },
    { name: 'Wakefit Memory Foam Pillow', brand: 'Wakefit', price: 1999, discountPrice: 1299, stock: 20, images: [{ url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&q=80' }], ...groupBuy, ...{
      slug: 'wakefit-memory-foam-pillow', description: 'Ergonomic, washable cover.', shortDesc: 'Memory foam pillow', category: catMap['Home & Living'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['pillow','wakefit','bedding'], }, },
    { name: 'Milton Thermosteel Flask', brand: 'Milton', price: 1499, discountPrice: 999, stock: 20, images: [{ url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=600&q=80' }], ...groupBuy, ...{
      slug: 'milton-thermosteel-flask', description: 'Stainless steel, 24hr hot/cold.', shortDesc: 'Water flask', category: catMap['Home & Living'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['flask','milton','kitchen'], }, },

    // Sports
    { name: 'Yonex Badminton Racket', brand: 'Yonex', price: 3499, discountPrice: 2499, stock: 20, images: [{ url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80' }], ...groupBuy, ...{
      slug: 'yonex-badminton-racket', description: 'Lightweight, graphite shaft.', shortDesc: 'Badminton racket', category: catMap['Sports'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['racket','yonex','sports'], }, },
    { name: 'Nivia Football', brand: 'Nivia', price: 1299, discountPrice: 899, stock: 20, images: [{ url: 'https://images.unsplash.com/photo-1505843273132-b09c3163a791?w=600&q=80' }], ...groupBuy, ...{
      slug: 'nivia-football', description: 'FIFA quality, all-weather.', shortDesc: 'Football', category: catMap['Sports'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['football','nivia','sports'], }, },
    { name: 'SG Cricket Bat', brand: 'SG', price: 4999, discountPrice: 3999, stock: 20, images: [{ url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80' }], ...groupBuy, ...{
      slug: 'sg-cricket-bat', description: 'English willow, lightweight.', shortDesc: 'Cricket bat', category: catMap['Sports'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['cricket','bat','sg','sports'], }, },

    // Beauty
    { name: 'Maybelline Fit Me Foundation', brand: 'Maybelline', price: 599, discountPrice: 449, stock: 20, images: [{ url: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&q=80' }], ...groupBuy, ...{
      slug: 'maybelline-fit-me-foundation', description: 'Matte + poreless, 18 shades.', shortDesc: 'Foundation', category: catMap['Beauty'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['foundation','maybelline','beauty'], }, },
    { name: 'Lakme Eyeconic Kajal', brand: 'Lakme', price: 299, discountPrice: 199, stock: 20, images: [{ url: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&q=80' }], ...groupBuy, ...{
      slug: 'lakme-eyeconic-kajal', description: 'Smudge-proof, 22hr stay.', shortDesc: 'Kajal', category: catMap['Beauty'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['kajal','lakme','beauty'], }, },

    // Books
    { name: 'Atomic Habits', brand: 'Penguin', price: 699, discountPrice: 499, stock: 20, images: [{ url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80' }], ...groupBuy, ...{
      slug: 'atomic-habits', description: 'James Clear, self-improvement bestseller.', shortDesc: 'Paperback', category: catMap['Books'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['book','atomic habits','james clear'], }, },
    { name: 'The Alchemist', brand: 'HarperOne', price: 499, discountPrice: 349, stock: 20, images: [{ url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80' }], ...groupBuy, ...{
      slug: 'the-alchemist', description: 'Paulo Coelho, modern classic.', shortDesc: 'Paperback', category: catMap['Books'], ecoScore: randomEco(), deliveryDays: delivery(), sold: randomSold(), ratings: randomRating(), numReviews: randomReviews(), tags: ['book','alchemist','coelho'], }, },
  ];

  await Product.insertMany(allProducts);

  console.log(`✅ Seeded: ${createdCats.length} categories, ${allProducts.length} products`);
  console.log(`👤 Admin: admin@shopverse.com / admin123`);
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
