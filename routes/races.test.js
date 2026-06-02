import request from 'supertest';

import server from '../server';
import * as testUtils from '../testUtils';

import models from '../models';

describe('/races', () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  const race0 = {
    name: 'Yellowstone Wild Run',
    park: 'Yellowstone National Park',
    country: 'USA',
    date: '2026-08-15T00:00:00.000Z',
    charityOrg: 'Yellowstone Forever',
    spotsAvailable: 500,
    entryFee: 150,
  };

  const race1 = {
    name: 'Serengeti Wild Run',
    park: 'Serengeti National Park',
    country: 'Tanzania',
    date: '2026-09-25T00:00:00.000Z',
    charityOrg: 'Jane Goodall Institute',
    spotsAvailable: 1000,
    entryFee: 300,
  };

  describe('Before login', () => {
    describe('POST /', () => {
      it('should send 401 without a token', async () => {
        const res = await request(server).post('/races').send(race0);
        expect(res.statusCode).toEqual(401);
      });

      it('should send 401 with a bad token', async () => {
        const res = await request(server)
          .post('/races')
          .set('Authorization', 'Bearer BAD')
          .send(race0);
        expect(res.statusCode).toEqual(401);
      });
    });

    describe('GET /', () => {
      it('should send 401 without a token', async () => {
        const res = await request(server).get('/races').send();
        expect(res.statusCode).toEqual(401);
      });

      it('should send 401 with a bad token', async () => {
        const res = await request(server)
          .get('/races')
          .set('Authorization', 'Bearer BAD')
          .send();
        expect(res.statusCode).toEqual(401);
      });
    });

    describe('GET /:id', () => {
      it('should send 401 without a token', async () => {
        const res = await request(server).get('/races/123').send();
        expect(res.statusCode).toEqual(401);
      });

      it('should send 401 with a bad token', async () => {
        const res = await request(server)
          .get('/races/456')
          .set('Authorization', 'Bearer BAD')
          .send();
        expect(res.statusCode).toEqual(401);
      });
    });
  });

  describe('After login', () => {
    const user0 = {
      email: 'user0@mail.com',
      password: '123password',
      firstName: 'John',
      lastName: 'Smith',
    };
    const user1 = {
      email: 'user1@mail.com',
      password: '456password',
      firstName: 'Jane',
      lastName: 'Doe',
    };

    let token0;
    let adminToken;

    beforeEach(async () => {
      await request(server).post('/auth/signup').send(user0);
      const res0 = await request(server).post('/auth/login').send(user0);
      token0 = res0.body.token;
      await request(server).post('/auth/signup').send(user1);
      await models.Runner.updateOne(
        { email: user1.email },
        { $push: { roles: 'admin' } },
      );
      const res1 = await request(server).post('/auth/login').send(user1);
      adminToken = res1.body.token;
    });

    describe.each([race0, race1])('POST / race %#', (race) => {
      it('should send 403 to normal user and not store race', async () => {
        const res = await request(server)
          .post('/races')
          .set('Authorization', `Bearer ${token0}`)
          .send(race);
        expect(res.statusCode).toEqual(403);
        expect(await models.Race.countDocuments()).toEqual(0);
      });

      it('should send 200 to admin user and store race', async () => {
        const res = await request(server)
          .post('/races')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(race);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(race);
        const savedRace = await models.Race.findOne({ _id: res.body._id }).lean();
        const { date, ...raceWithoutDate } = race;
        expect(savedRace).toMatchObject(raceWithoutDate);
      });
    });

    describe.each([race0, race1])('PUT /:id race %#', (race) => {
      let originalRace;
      beforeEach(async () => {
        const res = await request(server)
          .post('/races')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(race);
        originalRace = res.body;
      });

      it('should send 403 to normal user and not update race', async () => {
        const res = await request(server)
          .put(`/races/${originalRace._id}`)
          .set('Authorization', `Bearer ${token0}`)
          .send({ ...race, spotsAvailable: race.spotsAvailable + 100 });
        expect(res.statusCode).toEqual(403);
        const newRace = await models.Race.findById(originalRace._id).lean();
        expect(newRace.spotsAvailable).toEqual(race.spotsAvailable);
      });

      it('should send 200 to admin user and update race', async () => {
        const res = await request(server)
          .put(`/races/${originalRace._id}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ ...race, spotsAvailable: race.spotsAvailable + 100 });
        expect(res.statusCode).toEqual(200);
        const newRace = await models.Race.findById(originalRace._id).lean();
        expect(newRace.spotsAvailable).toEqual(race.spotsAvailable + 100);
      });
    });

    describe.each([race0, race1])('GET /:id race %#', (race) => {
      let originalRace;
      beforeEach(async () => {
        const res = await request(server)
          .post('/races')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(race);
        originalRace = res.body;
      });

      it('should send 200 to normal user and return race', async () => {
        const res = await request(server)
          .get(`/races/${originalRace._id}`)
          .set('Authorization', `Bearer ${token0}`)
          .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(race);
      });

      it('should send 200 to admin user and return race', async () => {
        const res = await request(server)
          .get(`/races/${originalRace._id}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(race);
      });
    });

    describe('GET /', () => {
      beforeEach(async () => {
        await request(server)
          .post('/races')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(race0);
        await request(server)
          .post('/races')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(race1);
      });

      it('should send 200 to normal user and return all races', async () => {
        const res = await request(server)
          .get('/races')
          .set('Authorization', `Bearer ${token0}`)
          .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject([race0, race1]);
      });

      it('should send 200 to admin user and return all races', async () => {
        const res = await request(server)
          .get('/races')
          .set('Authorization', `Bearer ${adminToken}`)
          .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject([race0, race1]);
      });
    });
  });
});