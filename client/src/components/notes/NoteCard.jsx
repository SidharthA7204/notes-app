import React from 'react';
import { Pin, Edit3, Trash2, Calendar } from 'lucide-react';
import { useNotes } from '../../context/NotesContext.jsx';

export const NoteCard = ({ note, onEdit, onDelete }) => {
  const { togglePin } = useNotes();

  const formattedDate = new Date(note.updatedAt || note.createdAt).toLocaleDateString(
    undefined,
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  );

  return (
    <article className={`note-card ${note.isPinned ? 'pinned' : ''}`}>
      <div className="note-card-header">
        <h3 className="note-title">{note.title}</h3>
        <button
          onClick={() => togglePin(note._id)}
          className={`btn-icon ${note.isPinned ? 'active' : ''}`}
          title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
          aria-label={note.isPinned ? 'Unpin note' : 'Pin note to top'}
        >
          <Pin size={17} fill={note.isPinned ? 'currentColor' : 'none'} />
        </button>
      </div>

      <p className="note-content">{note.content}</p>

      <div className="note-card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span className="category-tag">{note.category || 'General'}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Calendar size={13} />
            {formattedDate}
          </span>
        </div>

        <div className="note-card-actions">
          <button
            onClick={() => onEdit(note)}
            className="btn-icon"
            title="Edit note"
            aria-label="Edit note"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete(note)}
            className="btn-icon"
            style={{ color: 'var(--color-danger)' }}
            title="Delete note"
            aria-label="Delete note"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default NoteCard;
