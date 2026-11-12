import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a note title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide note content'],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
      maxlength: [30, 'Category cannot exceed 30 characters'],
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '#ffffff',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient user-scoped queries ordered by update time
noteSchema.index({ user: 1, updatedAt: -1 });
noteSchema.index({ user: 1, isPinned: -1, updatedAt: -1 });

const Note = mongoose.model('Note', noteSchema);
export default Note;
