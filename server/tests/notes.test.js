import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Note from '../src/models/Note.js';

let user1Token;
let user1Id;
let user2Token;
let user2Id;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
  await User.deleteMany({});
  await Note.deleteMany({});

  // Register User 1
  const u1Res = await request(app).post('/api/auth/register').send({
    name: 'User One',
    email: 'user1@example.com',
    password: 'password123',
  });
  user1Token = u1Res.body.token;
  user1Id = u1Res.body.user._id;

  // Register User 2
  const u2Res = await request(app).post('/api/auth/register').send({
    name: 'User Two',
    email: 'user2@example.com',
    password: 'password123',
  });
  user2Token = u2Res.body.token;
  user2Id = u2Res.body.user._id;
});

afterAll(async () => {
  await User.deleteMany({});
  await Note.deleteMany({});
  await mongoose.connection.close();
});

describe('Notes CRUD and Strict User Isolation', () => {
  let user1NoteId;

  it('POST /api/notes should create a note for authenticated user', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'User 1 Confidential Note',
        content: 'This note belongs exclusively to User 1.',
        category: 'Work',
        isPinned: true,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.note.title).toBe('User 1 Confidential Note');
    expect(res.body.note.user.toString()).toBe(user1Id);
    expect(res.body.note.isPinned).toBe(true);

    user1NoteId = res.body.note._id;
  });

  it('POST /api/notes should reject note without title', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: '',
        content: 'Content without title',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/notes should reject unauthorized requests', async () => {
    const res = await request(app)
      .post('/api/notes')
      .send({
        title: 'Unauthorized Note',
        content: 'No token passed',
      });

    expect(res.status).toBe(401);
  });

  it('GET /api/notes should return only notes owned by the authenticated user', async () => {
    // User 1 requests their notes
    const res1 = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res1.status).toBe(200);
    expect(res1.body.notes).toHaveLength(1);
    expect(res1.body.notes[0]._id).toBe(user1NoteId);

    // User 2 requests their notes (should be empty!)
    const res2 = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${user2Token}`);

    expect(res2.status).toBe(200);
    expect(res2.body.notes).toHaveLength(0);
  });

  it('GET /api/notes/:id should allow owner to fetch single note', async () => {
    const res = await request(app)
      .get(`/api/notes/${user1NoteId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
    expect(res.body.note._id).toBe(user1NoteId);
    expect(res.body.note.title).toBe('User 1 Confidential Note');
  });

  it('SECURITY TEST: User 2 cannot read User 1 note (returns 404)', async () => {
    const res = await request(app)
      .get(`/api/notes/${user1NoteId}`)
      .set('Authorization', `Bearer ${user2Token}`);

    // Return 404 to avoid leaking resource existence
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('PUT /api/notes/:id should allow owner to update note', async () => {
    const res = await request(app)
      .put(`/api/notes/${user1NoteId}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'User 1 Updated Note',
        content: 'Updated content body',
      });

    expect(res.status).toBe(200);
    expect(res.body.note.title).toBe('User 1 Updated Note');
    expect(res.body.note.content).toBe('Updated content body');
  });

  it('SECURITY TEST: User 2 cannot update User 1 note (returns 404)', async () => {
    const res = await request(app)
      .put(`/api/notes/${user1NoteId}`)
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        title: 'Hacked Title',
        content: 'Hacked content',
      });

    expect(res.status).toBe(404);

    // Verify User 1 note was untouched
    const verifyRes = await request(app)
      .get(`/api/notes/${user1NoteId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(verifyRes.body.note.title).toBe('User 1 Updated Note');
  });

  it('SECURITY TEST: User 2 cannot delete User 1 note (returns 404)', async () => {
    const res = await request(app)
      .delete(`/api/notes/${user1NoteId}`)
      .set('Authorization', `Bearer ${user2Token}`);

    expect(res.status).toBe(404);

    // Verify note is still in database
    const verifyRes = await request(app)
      .get(`/api/notes/${user1NoteId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(verifyRes.status).toBe(200);
  });

  it('DELETE /api/notes/:id should allow owner to delete note', async () => {
    const res = await request(app)
      .delete(`/api/notes/${user1NoteId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);

    // Confirm deletion
    const verifyRes = await request(app)
      .get(`/api/notes/${user1NoteId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(verifyRes.status).toBe(404);
  });
});
