import { expect } from 'chai';
import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';

// Setup chai
chai.use(chaiHttp);

// Global test setup
global.expect = expect;
global.sinon = sinon;

// Setup test database
before(async () => {
  const testDbUri = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/health-platform-test';
  await mongoose.connect(testDbUri);
});

// Cleanup after all tests
after(async () => {
  // Clear all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    if (collections[key]) {
      await collections[key].deleteMany({});
    }
  }
  // Close database connection
  await mongoose.connection.close();
});

// Clean up before each test
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    if (collections[key]) {
      await collections[key].deleteMany({});
    }
  }
});