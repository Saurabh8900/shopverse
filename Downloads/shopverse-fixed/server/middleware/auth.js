import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  let token = req.headers.authorization?.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : null;

  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'shopverse_secret_2024');
    req.user = { id: decoded.id };
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

export const admin = (req, res, next) => {
  const db = req.app.get('db');
  const user = db.prepare('SELECT isAdmin FROM users WHERE id = ?').get(req.user.id);
  if (user?.isAdmin === 1) return next();
  res.status(403).json({ message: 'Admin access only' });
};

export const seller = (req, res, next) => {
  // For simplicity, sellers are also admins in this version
  const db = req.app.get('db');
  const user = db.prepare('SELECT isAdmin FROM users WHERE id = ?').get(req.user.id);
  if (user?.isAdmin === 1) return next();
  res.status(403).json({ message: 'Seller access only' });
};
