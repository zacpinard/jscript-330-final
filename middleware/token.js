import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'secret';

export const isAuthorized = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.sendStatus(401);
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.sendStatus(401);
  }
};

export const isRaceAdmin = (req, res, next) => {
  if (!req.user?.roles?.includes('admin')) {
    res.sendStatus(403);
    return;
  }
  next();
};
