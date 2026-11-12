import Note from '../models/Note.js';

/**
 * @desc    Get all notes for authenticated user with optional search and category filter
 * @route   GET /api/notes
 * @access  Private (Owner only)
 */
export const getNotes = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };

    // Optional search term filter (case-insensitive on title or content)
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      filter.$or = [{ title: searchRegex }, { content: searchRegex }];
    }

    // Optional category filter
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }

    // Optional pinned filter
    if (req.query.isPinned !== undefined) {
      filter.isPinned = req.query.isPinned === 'true';
    }

    // Order pinned notes first, then latest updated
    const notes = await Note.find(filter).sort({ isPinned: -1, updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single note by ID (verifying ownership)
 * @route   GET /api/notes/:id
 * @access  Private (Owner only)
 */
export const getNoteById = async (req, res, next) => {
  try {
    // Strictly isolate query by both note ID and user ID
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new note
 * @route   POST /api/notes
 * @access  Private
 */
export const createNote = async (req, res, next) => {
  try {
    const { title, content, category, isPinned, color } = req.body;

    const note = await Note.create({
      user: req.user._id,
      title: title.trim(),
      content: content.trim(),
      category: category ? category.trim() : 'General',
      isPinned: Boolean(isPinned),
      color: color || '#ffffff',
    });

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      note,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing note (verifying ownership)
 * @route   PUT /api/notes/:id
 * @access  Private (Owner only)
 */
export const updateNote = async (req, res, next) => {
  try {
    const { title, content, category, isPinned, color } = req.body;

    // Strictly ensure only the owner can update their note
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    if (title !== undefined) note.title = title.trim();
    if (content !== undefined) note.content = content.trim();
    if (category !== undefined) note.category = category.trim();
    if (isPinned !== undefined) note.isPinned = Boolean(isPinned);
    if (color !== undefined) note.color = color;

    const updatedNote = await note.save();

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      note: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a note (verifying ownership)
 * @route   DELETE /api/notes/:id
 * @access  Private (Owner only)
 */
export const deleteNote = async (req, res, next) => {
  try {
    // Strictly ensure only the owner can delete their note
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};
