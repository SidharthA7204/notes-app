import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod;

export async function setup() {
  console.log('[Test Setup] Starting MongoMemoryServer (version 6.0.16)...');
  mongod = await MongoMemoryServer.create({
    binary: {
      version: '6.0.16',
    },
  });
  const uri = mongod.getUri();
  process.env.MONGODB_URI = uri;
  process.env.JWT_SECRET = 'test_secret_key_123';
  process.env.NODE_ENV = 'test';
  console.log(`[Test Setup] MongoMemoryServer ready at ${uri}`);
}

export async function teardown() {
  if (mongod) {
    console.log('[Test Teardown] Stopping MongoMemoryServer...');
    await mongod.stop();
  }
}
