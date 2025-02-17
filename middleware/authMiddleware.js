import jwt from 'jsonwebtoken';

// Middleware to verify JWT tokens
export const authenticateToken = (req, res, next) => {
  // Expect the token in the 'Authorization' header as 'Bearer <token>'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token is invalid or expired' });
    req.user = user;
    next();
  });
};