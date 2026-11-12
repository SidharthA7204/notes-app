import React, { useState } from 'react';
import Modal from '../common/Modal.jsx';
import Spinner from '../common/Spinner.jsx';
import Alert from '../common/Alert.jsx';
import { useNotes } from '../../context/NotesContext.jsx';

export const DeleteConfirmModal = ({ isOpen, onClose, noteToDelete }) => {
  const { deleteNote } = useNotes();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!noteToDelete) return null;

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    const result = await deleteNote(noteToDelete._id);
    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Note">
      <div className="modal-body">
        {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Are you sure you want to permanently delete{' '}
          <strong style={{ color: 'var(--color-text)' }}>"{noteToDelete.title}"</strong>?
          This action cannot be undone.
        </p>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading && <Spinner />}
          <span>Delete Note</span>
        </button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
