import { Router } from 'express';
import authRouter from './auth';
import itemsRouter from './runners';
import ordersRouter from './races';

const router = Router();

router.use('/auth', authRouter);
router.use('/items', itemsRouter);
router.use('/orders', ordersRouter);

export default router;
