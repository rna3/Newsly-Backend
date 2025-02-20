import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  // Check for the token in the cookies first
  const token = req.cookies?.accessToken || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token is invalid or expired' });
    req.user = user;
    next();
  });
};
