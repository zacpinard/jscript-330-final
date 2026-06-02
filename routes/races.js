import { Router } from 'express';
import * as raceDao from '../daos/race';
import { isAuthorized, isRaceAdmin } from '../middleware/token';

const router = Router();

router.post('/', isAuthorized, isRaceAdmin, async (req, res, next) => {
  try {
    const item = await raceDao.createRace(req.body);
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.put('/:id', isAuthorized, isRaceAdmin, async (req, res, next) => {
  try {
    await raceDao.updateRace(req.params.id, req.body);
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});

router.get('/', isAuthorized, async (req, res, next) => {
  try {
    const races = await raceDao.getAll();
    res.json(races);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', isAuthorized, async (req, res, next) => {
  try {
    const race = await raceDao.getById(req.params.id);
    res.json(race);
  } catch (e) {
    next(e);
  }
});

router.get('/:id/runners', isAuthorized, isRaceAdmin, async (req, res, next) => {
  try {
    const race = await raceDao.getRaceWithRunners(req.params.id);
    if (!race) {
      res.sendStatus(404);
      return;
    }
    res.json(race);
  } catch (e) {
    next (e);
  }
});

export default router;
