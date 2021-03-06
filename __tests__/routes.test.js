/* eslint-disable no-unused-vars */
'use strict';

const server = require('../src/app').server;
const supergoose = require('./supergoose.js');
const mockRequest = supergoose.server(server);
const Job = require('../src/model/job');
const User = require('../src/model/user');
const job = require('../src/routes/jobRoutes');

const jobs = {
  gardening: {name: 'Gardening', description: 'Mowing my lawn', price: 50, jobType: 'Manual Labor'},
  roofing : {name: 'Roofing', description: 'Cleaning off the roof', price: 20, jobType: 'Manual Labor'},
};

let users = {
  admin: {username: 'admin', password: 'password', email: 'admin@admin.com', role: 'admin'},
};

beforeAll(async (done) => {
  await supergoose.startDB();
  const adminUser = await new User(users.admin).save();
  const gardeningJob = await new Job(jobs.gardening).save();
  const roofingJob = await new Job(jobs.roofing).save();
  done();
});
afterAll(done => {
  supergoose.stopDB;
  done();
});

//__________________ JOB ROUTES TESTING ______________________
describe('Jobs route API testing', () => {

  xit('Returns error 500 when sent invalid object', async () => {

    let foundUser = await User.find({});
    let token = User().generateToken(foundUser);
    const req = {
      body: {
        name: 'Testing',
        description: 'Test Job',
        price: 30,
        jobType: 'Testing my jobs out',
        postedBy: foundUser._id,
      },
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    let res = {};
    let next = jest.fn();

    let postedJob = await job.jobPost(req, res, next);
  });

  it('Returns 0 when no jobs posted in database', () => {
    return mockRequest
      .get('/jobs')
      .then(data => {        
        expect(data.body.count).toEqual(2);
      });
  });

  it('can get() ONE job', () => {
    return mockRequest.get('/jobs')
      .expect(200)
      .then(results => {
        expect(results.body).toBeDefined();
      });
  });
  
  it('can update() a job', async () => {
    let jobs = await Job.find({});
    expect(jobs[0].id).toBeDefined();
    const req = {
      body: {
        name: 'Roofing', description: 'Cleaning off the roof', price: 20, jobType: 'Manual Labor',
      },
      params: {
        id: jobs[0].id,
      },
    };
    let res = {};
    let next = jest.fn();

    let updated = await job.jobUpdate(req, res, next);
    expect(updated).not.toBeDefined();
  });
  
  it('can delete a job', async () => {
    let jobs = await Job.find({});
    expect(jobs[0].id).toBeDefined();
    const req = {
      params: {
        id: jobs[0].id,
      },
    };
    let res = {};
    let next = jest.fn();

    let deleted = await job.jobDelete(req, res, next);
    expect(deleted).not.toBeDefined();
  });
});

describe('OAuth Routes', () => {

  it('Github OAuth Route', () => {
    return mockRequest.get('/ghoauth')
      .expect(200);
  });

  it('Google OAuth Route', () => {
    return mockRequest.get('/ggoauth')
      .expect(200);
  });
});

describe('General Routing', () => {

  it('Roles Route functioning', () => {
    return mockRequest.post('/roles')
      .expect(200)
      .then(result => {
        expect(result.text).toBe('Roles Created');
      });
  });
});

