import { Request, Response } from 'express';
import sinon from 'sinon';

// Mock Express Request and Response
export const createMockRequest = (body: any = {}, params: any = {}, query: any = {}): Request => {
  return {
    body,
    params,
    query,
    headers: {},
    get: (header: string) => undefined
  } as Request;
};

export const createMockResponse = (): Response & {
  status: sinon.SinonStub;
  json: sinon.SinonStub;
  send: sinon.SinonStub;
} => {
  const res: any = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  res.send = sinon.stub().returns(res);
  return res;
};

// Create test user data
export const createTestUserData = (overrides = {}) => ({
  userType: 'patient',
  email: 'test@example.com',
  password: 'TestPassword123!',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  dateOfBirth: '1990-01-01',
  ...overrides
});

// Wait for async operations
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));