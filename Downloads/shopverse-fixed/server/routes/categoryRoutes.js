import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const db = req.app.get('db');
  const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();
  res.json(categories.map(c => ({ _id: c.id, name: c.name, slug: c.slug, image: c.image })));
}));

router.post('/', protect, admin, asyncHandler(async (req, res) => {
  const db = req.app.get('db');
  const { name, slug, image } = req.body;
  const result = db.prepare('INSERT INTO categories (name, slug, image) VALUES (?, ?, ?)').run(name, slug, image);
  res.status(201).json({ id: result.lastInsertRowid, name, slug, image });
}));

router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
  const db = req.app.get('db');
  const { name, slug, image } = req.body;
  db.prepare('UPDATE categories SET name = ?, slug = ?, image = ? WHERE id = ?').run(name, slug, image, req.params.id);
  const cat = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  res.json({ _id: cat.id, name: cat.name, slug: cat.slug, image: cat.image });
}));
}));

router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
}));

export default router;
