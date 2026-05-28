import { Router } from 'express';
import * as orderDao from '../daos/order';
import * as itemDao from '../daos/item';
import { isAuthorized } from '../middleware/token';

const router = Router();

router.post('/', isAuthorized, async (req, res, next) => {
  try {
    const itemIds = req.body;
    const items = await Promise.all(itemIds.map((id) => itemDao.getById(id)));
    if (items.some((item) => !item)) {
      res.sendStatus(400);
      return;
    }
    const total = items.reduce((sum, item) => sum + item.price, 0);
    const order = await orderDao.createOrder({
      userId: req.user._id,
      items: itemIds,
      total,
    });
    res.json(order);
  } catch (e) {
    next(e);
  }
});

router.get('/', isAuthorized, async (req, res, next) => {
  try {
    const admin = req.user.roles.includes('admin');
    const orders = admin
      ? await orderDao.getAllOrders()
      : await orderDao.getOrdersByUserId(req.user._id);
    res.json(orders);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', isAuthorized, async (req, res, next) => {
  try {
    const order = await orderDao.getOrderByIdPopulated(req.params.id);
    if (!order) {
      res.sendStatus(404);
      return;
    }
    const admin = req.user.roles.includes('admin');
    if (!admin && order.userId.toString() !== req.user._id) {
      res.sendStatus(404);
      return;
    }
    res.json(order);
  } catch (e) {
    next(e);
  }
});

export default router;
