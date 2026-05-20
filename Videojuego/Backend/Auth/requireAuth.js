import jwt from 'jsonwebtoken';

// Verifies the JWT issued by /auth/login or /auth/register and attaches
// { id, username } to req.user. All saved-game routes scope queries by
// req.user.id so a user can never read or mutate another user's saves.
export default function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Missing authentication token.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, username: payload.username };
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
}
