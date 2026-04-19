import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('shopverse.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    isAdmin INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    image TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    originalPrice REAL,
    image TEXT,
    images TEXT,
    categoryId INTEGER,
    countInStock INTEGER DEFAULT 0,
    priceDrop INTEGER DEFAULT 0,
    priceDropEnds TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    orderItems TEXT NOT NULL,
    shippingAddress TEXT NOT NULL,
    paymentMethod TEXT NOT NULL,
    paymentResult TEXT,
    itemsPrice REAL NOT NULL,
    taxPrice REAL NOT NULL,
    shippingPrice REAL NOT NULL,
    totalPrice REAL NOT NULL,
    isPaid INTEGER DEFAULT 0,
    paidAt TEXT,
    isDelivered INTEGER DEFAULT 0,
    deliveredAt TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`);

// Seed function
export function seedDatabase() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  
  if (userCount.count === 0) {
    console.log('🌱 Seeding database...');
    
    // Seed categories
    const categories = [
      { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
      { name: 'Clothing', slug: 'clothing', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400' },
      { name: 'Home & Garden', slug: 'home-garden', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' },
      { name: 'Sports', slug: 'sports', image: 'https://images.unsplash.com/photo-1461896836934- voices-cc0ed63a-9315?w=400' },
      { name: 'Books', slug: 'books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400' },
      { name: 'Beauty', slug: 'beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400' }
    ];
    
    const insertCategory = db.prepare('INSERT INTO categories (name, slug, image) VALUES (?, ?, ?)');
    categories.forEach(c => insertCategory.run(c.name, c.slug, c.image));
    
    // Seed products
    const products = [
      { name: 'Wireless Bluetooth Headphones', slug: 'wireless-headphones', description: 'High-quality wireless headphones with noise cancellation', price: 79.99, originalPrice: 129.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', categoryId: 1, countInStock: 25, priceDrop: 1, priceDropEnds: '2026-04-25' },
      { name: 'Smart Watch Pro', slug: 'smart-watch-pro', description: 'Advanced smartwatch with health monitoring', price: 199.99, originalPrice: 299.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', categoryId: 1, countInStock: 15, priceDrop: 1, priceDropEnds: '2026-04-30' },
      { name: 'Running Shoes', slug: 'running-shoes', description: 'Comfortable running shoes for athletes', price: 89.99, originalPrice: 119.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', categoryId: 4, countInStock: 30, priceDrop: 0, priceDropEnds: null },
      { name: 'Cotton T-Shirt', slug: 'cotton-tshirt', description: 'Premium cotton t-shirt', price: 24.99, originalPrice: 34.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', categoryId: 2, countInStock: 50, priceDrop: 1, priceDropEnds: '2026-04-22' },
      { name: 'Laptop Stand', slug: 'laptop-stand', description: 'Ergonomic laptop stand for better posture', price: 39.99, originalPrice: 59.99, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', categoryId: 1, countInStock: 20, priceDrop: 1, priceDropEnds: '2026-04-28' },
      { name: 'Yoga Mat', slug: 'yoga-mat', description: 'Non-slip yoga mat', price: 29.99, originalPrice: 49.99, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', categoryId: 4, countInStock: 35, priceDrop: 0, priceDropEnds: null },
      { name: 'Face Cream', slug: 'face-cream', description: 'Natural face cream for all skin types', price: 34.99, originalPrice: 44.99, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', categoryId: 6, countInStock: 40, priceDrop: 1, priceDropEnds: '2026-04-26' },
      { name: 'Coffee Maker', slug: 'coffee-maker', description: 'Automatic coffee maker', price: 69.99, originalPrice: 99.99, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400', categoryId: 3, countInStock: 18, priceDrop: 1, priceDropEnds: '2026-04-24' },
      { name: 'Programming Book', slug: 'programming-book', description: 'Learn JavaScript from scratch', price: 44.99, originalPrice: 59.99, image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', categoryId: 5, countInStock: 100, priceDrop: 0, priceDropEnds: null },
      { name: 'Desk Lamp', slug: 'desk-lamp', description: 'LED desk lamp with adjustable brightness', price: 49.99, originalPrice: 69.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', categoryId: 3, countInStock: 22, priceDrop: 1, priceDropEnds: '2026-04-27' }
    ];
    
    const insertProduct = db.prepare(`
      INSERT INTO products (name, slug, description, price, originalPrice, image, categoryId, countInStock, priceDrop, priceDropEnds)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    products.forEach(p => insertProduct.run(p.name, p.slug, p.description, p.price, p.originalPrice, p.image, p.categoryId, p.countInStock, p.priceDrop, p.priceDropEnds));
    
    // Create admin user
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)').run('Admin User', 'admin@shopverse.com', hashedPassword, 1);
    
    console.log('✅ Seeded: 6 categories, 10 products');
    console.log('👤 Admin: admin@shopverse.com / admin123');
  }
}

export default db;