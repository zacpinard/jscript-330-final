import { Router } from 'express';
import authRouter from './auth';
import racesRouter from './races';
import registrationsRouter from './registrations';

const router = Router();

router.use('/auth', authRouter);
router.use('/races', racesRouter);
router.use('/registrations', registrationsRouter);

export default router;
