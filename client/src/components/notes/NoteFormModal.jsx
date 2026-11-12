import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal.jsx';
import Spinner from '../common/Spinner.jsx';
import Alert from '../common/Alert.jsx';
import { useNotes, CATEGORIES } from '../../context/NotesContext.jsx';

export const NoteFormModal = ({ isOpen, onClose, noteToEdit }) => {
  const { createNote, updateNote } = useNotes();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [isPinned, setIsPinned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync state when editing or opening
  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title || '');
      setContent(noteToEdit.content || '');
      setCategory(noteToEdit.category || 'General');
      setIsPinned(noteToEdit.isPinned || false);
    } else {
      setTitle('');
      setContent('');
      setCategory('General');
      setIsPinned(false);
    }
    setError(null);
  }, [noteToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      title: title.trim(),
      content: content.trim(),
      category: category.trim() || 'General',
      isPinned,
    };

    let result;
    if (noteToEdit) {
      result = await updateNote(noteToEdit._id, payload);
    } else {
      result = await createNote(payload);
    }

    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }
  };

  const selectableCategories = CATEGORIES.filter((c) => c !== 'All');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={noteToEdit ? 'Edit Note' : 'Create New Note'}
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}

          <div className="form-group">
            <label className="form-label" htmlFor="note-title">
              Title <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              id="note-title"
              type="text"
              className="form-control"
              placeholder="e.g. Sprint Planning Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={150}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="note-category">
              Category
            </label>
            <select
              id="note-category"
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {selectableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="note-content">
              Content <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <textarea
              id="note-content"
              className="form-control"
              placeholder="Write your note contents here..."
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.6rem' }}>
            <input
              type="checkbox"
              id="note-pin"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="note-pin" className="form-label" style={{ cursor: 'pointer', marginBottom: 0 }}>
              Pin this note to the top of your dashboard
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading && <Spinner />}
            <span>{noteToEdit ? 'Save Changes' : 'Create Note'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NoteFormModal;
