import { Router } from 'express';
import authRouter from './auth';
import itemsRouter from './items';
import ordersRouter from './orders';

const router = Router();

router.use('/auth', authRouter);
router.use('/items', itemsRouter);
router.use('/orders', ordersRouter);

export default router;
