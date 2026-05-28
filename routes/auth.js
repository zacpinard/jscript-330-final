import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userDao from '../daos/user';
import { isAuthorized } from '../middleware/token';

const router = Router();
const SECRET = process.env.JWT_SECRET || 'secret';

router.post('/signup', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!password) {
      res.sendStatus(400);
      return;
    }
    try {
      await userDao.createUser({ email, password });
      res.sendStatus(200);
    } catch (e) {
      if (e.code === 11000) {
        res.sendStatus(409);
      } else {
        next(e);
      }
    }
  } catch (e) {
    next(e);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!password) {
      res.sendStatus(400);
      return;
    }
    const user = await userDao.getByEmail(email);
    if (!user) {
      res.sendStatus(401);
      return;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.sendStatus(401);
      return;
    }
    const token = jwt.sign(
      { email: user.email, _id: user._id, roles: user.roles },
      SECRET,
    );
    res.json({ token });
  } catch (e) {
    next(e);
  }
});

router.put('/password', isAuthorized, async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password) {
      res.sendStatus(400);
      return;
    }
    await userDao.updatePassword(req.user._id, password);
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});

export default router;
