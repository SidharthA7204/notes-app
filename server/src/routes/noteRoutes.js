import express from 'express';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/noteController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateNote } from '../middleware/validateMiddleware.js';

const router = express.Router();

// Require JWT authentication for all note endpoints
router.use(protect);

router
  .route('/')
  .get(getNotes)
  .post(validateNote, createNote);

router
  .route('/:id')
  .get(getNoteById)
  .put(validateNote, updateNote)
  .patch(validateNote, updateNote)
  .delete(deleteNote);

export default router;
