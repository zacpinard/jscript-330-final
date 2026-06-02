import request from 'supertest';

import server from '../server';
import * as testUtils from '../testUtils';

import models from '../models';

describe('/registrations', () => {
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
        const res = await request(server).post('/registrations').send({});
        expect(res.statusCode).toEqual(401);
      });

      it('should send 401 with a bad token', async () => {
        const res = await request(server)
          .post('/registrations')
          .set('Authorization', 'Bearer BAD')
          .send({});
        expect(res.statusCode).toEqual(401);
      });
    });

    describe('GET /', () => {
      it('should send 401 without a token', async () => {
        const res = await request(server).get('/registrations').send();
        expect(res.statusCode).toEqual(401);
      });

      it('should send 401 with a bad token', async () => {
        const res = await request(server)
          .get('/registrations')
          .set('Authorization', 'Bearer BAD')
          .send();
        expect(res.statusCode).toEqual(401);
      });
    });

    describe('GET /:id', () => {
      it('should send 401 without a token', async () => {
        const res = await request(server).get('/registrations/123').send();
        expect(res.statusCode).toEqual(401);
      });

      it('should send 401 with a bad token', async () => {
        const res = await request(server)
          .get('/registrations/456')
          .set('Authorization', 'Bearer BAD')
          .send();
        expect(res.statusCode).toEqual(401);
      });
    });

    describe('DELETE /:id', () => {
      it('should send 401 without a token', async () => {
        const res = await request(server).delete('/registrations/123').send();
        expect(res.statusCode).toEqual(401);
      });

      it('should send 401 with a bad token', async () => {
        const res = await request(server)
          .delete('/registrations/456')
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
    let race0Id;
    let race1Id;

    beforeEach(async () => {
      // Set up users
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

      // Set up races
      const raceRes0 = await request(server)
        .post('/races')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(race0);
      race0Id = raceRes0.body._id;

      const raceRes1 = await request(server)
        .post('/races')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(race1);
      race1Id = raceRes1.body._id;
    });

    describe('POST /', () => {
      it('should send 404 with a bad race id', async () => {
        const res = await request(server)
          .post('/registrations')
          .set('Authorization', `Bearer ${token0}`)
          .send({ raceId: '000000000000000000000000' });
        expect(res.statusCode).toEqual(404);
      });

      it('should send 200 and create registration for normal user', async () => {
        const res = await request(server)
          .post('/registrations')
          .set('Authorization', `Bearer ${token0}`)
          .send({ raceId: race0Id });
        expect(res.statusCode).toEqual(200);
        const storedReg = await models.Registration.findOne().lean();
        expect(storedReg).toMatchObject({
          raceId: expect.anything(),
          runnerId: expect.anything(),
        });
      });

      it('should send 200 and create registration for admin user', async () => {
        const res = await request(server)
          .post('/registrations')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ raceId: race1Id });
        expect(res.statusCode).toEqual(200);
        const storedReg = await models.Registration.findOne().lean();
        expect(storedReg).toMatchObject({
          raceId: expect.anything(),
          runnerId: expect.anything(),
        });
      });
    });

    describe('GET /', () => {
      beforeEach(async () => {
        await request(server)
          .post('/registrations')
          .set('Authorization', `Bearer ${token0}`)
          .send({ raceId: race0Id });
        await request(server)
          .post('/registrations')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ raceId: race1Id });
      });

      it('should send 200 and return only own registrations for normal user', async () => {
        const res = await request(server)
          .get('/registrations')
          .set('Authorization', `Bearer ${token0}`)
          .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
      });

      it('should send 200 and return all registrations for admin', async () => {
        const res = await request(server)
          .get('/registrations')
          .set('Authorization', `Bearer ${adminToken}`)
          .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
      });
    });

    describe('GET /:id', () => {
      let reg0Id;
      let reg1Id;

      beforeEach(async () => {
        const res0 = await request(server)
          .post('/registrations')
          .set('Authorization', `Bearer ${token0}`)
          .send({ raceId: race0Id });
        reg0Id = res0.body._id;

        const res1 = await request(server)
          .post('/registrations')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ raceId: race1Id });
        reg1Id = res1.body._id;
      });

      it('should send 200 to normal user with their own registration', async () => {
        const res = await request(server)
          .get(`/registrations/${reg0Id}`)
          .set('Authorization', `Bearer ${token0}`)
          .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({ raceId: race0Id });
      });

      it("should send 404 to normal user with someone else's registration", async () => {
        const res = await request(server)
          .get(`/registrations/${reg1Id}`)
          .set('Authorization', `Bearer ${token0}`)
          .send();
        expect(res.statusCode).toEqual(404);
      });

      it('should send 200 to admin with any registration', async () => {
        const res = await request(server)
          .get(`/registrations/${reg0Id}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({ raceId: race0Id });
      });
    });

    describe('DELETE /:id', () => {
      let reg0Id;
      let reg1Id;

      beforeEach(async () => {
        const res0 = await request(server)
          .post('/registrations')
          .set('Authorization', `Bearer ${token0}`)
          .send({ raceId: race0Id });
        reg0Id = res0.body._id;

        const res1 = await request(server)
          .post('/registrations')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ raceId: race1Id });
        reg1Id = res1.body._id;
      });

      it('should send 200 and delete own registration for normal user', async () => {
        const res = await request(server)
          .delete(`/registrations/${reg0Id}`)
          .set('Authorization', `Bearer ${token0}`)
          .send();
        expect(res.statusCode).toEqual(200);
        const deleted = await models.Registration.findById(reg0Id).lean();
        expect(deleted).toBeNull();
      });

      it("should send 403 to normal user trying to delete someone else's registration", async () => {
        const res = await request(server)
          .delete(`/registrations/${reg1Id}`)
          .set('Authorization', `Bearer ${token0}`)
          .send();
        expect(res.statusCode).toEqual(403);
        const stillExists = await models.Registration.findById(reg1Id).lean();
        expect(stillExists).not.toBeNull();
      });

      it('should send 200 and allow admin to delete any registration', async () => {
        const res = await request(server)
          .delete(`/registrations/${reg0Id}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send();
        expect(res.statusCode).toEqual(200);
        const deleted = await models.Registration.findById(reg0Id).lean();
        expect(deleted).toBeNull();
      });
    });
  });
});