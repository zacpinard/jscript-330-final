import { Router } from 'express';
import * as itemDao from '../daos/item';
import { isAuthorized, isAdmin } from '../middleware/token';

const router = Router();

router.post('/', isAuthorized, isAdmin, async (req, res, next) => {
  try {
    const item = await itemDao.createItem(req.body);
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.put('/:id', isAuthorized, isAdmin, async (req, res, next) => {
  try {
    await itemDao.updateItem(req.params.id, req.body);
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});

router.get('/', isAuthorized, async (req, res, next) => {
  try {
    const items = await itemDao.getAll();
    res.json(items);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', isAuthorized, async (req, res, next) => {
  try {
    const item = await itemDao.getById(req.params.id);
    res.json(item);
  } catch (e) {
    next(e);
  }
});

export default router;
