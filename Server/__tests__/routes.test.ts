import { it, describe, expect } from '@jest/globals';
import request from 'supertest';
import app from '../src/app';

const testUser = {
  email: 'test@gmail.com',
  fullname: 'Test',
  mobile: '08090007000',
  password: 'Pas$word1',
};

// POST
describe('POST:', () => {
  it('should register new user to database', async () => {
    const res = await request(app).post('/auth/register').send(testUser);
    expect(res.status).toEqual(201);
  });

  it('should return status 500 for registering with existing email in database', async () => {
    const res = await request(app).post('/auth/register').send(testUser);
    expect(res.status).toEqual(500);
  });
});
