import { Router } from 'express';
import * as raceDao from '../daos/race';
import * as registrationDao from '../daos/registration';
import { isAuthorized, isRaceAdmin } from '../middleware/token';

const router = Router();

// Any runner can register for a race
router.post('/', isAuthorized, async (req, res, next) => {
  try {
    const { raceId } = req.body;
    const race = await raceDao.getById(raceId);
    if (!race) {
      res.sendStatus(404);
      return;
    }
    const registration = await registrationDao.createRegistration({
      runnerId: req.user._id,
      raceId,
    });
    res.json(registration);
  } catch (e) {
    next(e);
  }
});

// Runner sees their own registrations, admin sees all
router.get('/', isAuthorized, async (req, res, next) => {
  try {
    const admin = req.user.roles.includes('admin');
    const registrations = admin
      ? await registrationDao.getAllRegistrations()
      : await registrationDao.getRegistrationsByRunnerId(req.user._id);
    res.json(registrations);
  } catch (e) {
    next(e);
  }
});

// Runner can only see their own, admin can see any
router.get('/:id', isAuthorized, async (req, res, next) => {
  try {
    const registration = await registrationDao.getRegistrationByIdPopulated(req.params.id);
    if (!registration) {
      res.sendStatus(404);
      return;
    }
    const admin = req.user.roles.includes('admin');
    if (!admin && registration.runnerId.toString() !== req.user._id) {
      res.sendStatus(404);
      return;
    }
    res.json(registration);
  } catch (e) {
    next(e);
  }
});

// Runner can cancel their own registration, admin can cancel any
router.delete('/:id', isAuthorized, async (req, res, next) => {
  try {
    const registration = await registrationDao.getRegistrationById(req.params.id);
    if (!registration) {
      res.sendStatus(404);
      return;
    }
    const admin = req.user.roles.includes('admin');
    if (!admin && registration.runnerId.toString() !== req.user._id) {
      res.sendStatus(403);
      return;
    }
    await registrationDao.deleteRegistration(req.user._id)
    res.sendStatus(200);
  } catch (e) {
    next (e);
  }
});

export default router;
