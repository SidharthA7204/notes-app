import React, { useState } from 'react';
import { Plus, Pin, FileText, Sparkles, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotes } from '../context/NotesContext.jsx';
import NoteCard from '../components/notes/NoteCard.jsx';
import SearchBar from '../components/notes/SearchBar.jsx';
import NoteFormModal from '../components/notes/NoteFormModal.jsx';
import DeleteConfirmModal from '../components/notes/DeleteConfirmModal.jsx';
import Alert from '../components/common/Alert.jsx';
import Spinner from '../components/common/Spinner.jsx';

export const DashboardPage = () => {
  const { user } = useAuth();
  const {
    notes,
    pinnedNotes,
    regularNotes,
    loading,
    error,
    searchTerm,
    selectedCategory,
    setSearchTerm,
    setSelectedCategory,
    fetchNotes,
  } = useNotes();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const handleOpenCreateModal = () => {
    setNoteToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (note) => {
    setNoteToEdit(note);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (note) => {
    setNoteToDelete(note);
    setIsDeleteModalOpen(true);
  };

  const hasFilter = searchTerm.trim().length > 0 || selectedCategory !== 'All';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    fetchNotes('', 'All');
  };

  return (
    <div className="dashboard-container">
      {/* Header section */}
      <div className="dashboard-header">
        <div className="dashboard-title-group">
          <h1>
            Hello, {user?.name ? user.name.split(' ')[0] : 'there'} 👋
          </h1>
          <p>
            {notes.length === 0
              ? 'Your workspace is clear and ready for new thoughts.'
              : `You have ${notes.length} note${notes.length === 1 ? '' : 's'}${
                  pinnedNotes.length > 0
                    ? ` (${pinnedNotes.length} pinned)`
                    : ''
                }.`}
          </p>
        </div>

        <button onClick={handleOpenCreateModal} className="btn btn-primary">
          <Plus size={18} />
          <span>New Note</span>
        </button>
      </div>

      {/* Search and filters */}
      <SearchBar />

      {/* Global alert error if any */}
      {error && (
        <Alert
          type="danger"
          message={error}
          onClose={() => fetchNotes(searchTerm, selectedCategory)}
        />
      )}

      {/* Loading state */}
      {loading && notes.length === 0 ? (
        <div
          style={{
            padding: '4rem 1rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <Spinner size="large" />
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading your notes...</p>
        </div>
      ) : notes.length === 0 ? (
        /* Empty states */
        <div className="empty-state">
          <div className="empty-state-icon">
            {hasFilter ? <FileText size={48} /> : <Sparkles size={48} />}
          </div>
          <h3>{hasFilter ? 'No matching notes found' : 'No notes yet'}</h3>
          <p>
            {hasFilter
              ? 'Try adjusting your search terms or category filter to discover existing notes.'
              : 'Capture your thoughts, code snippets, meeting minutes, and tasks in one place.'}
          </p>
          {hasFilter ? (
            <button onClick={resetFilters} className="btn btn-secondary">
              <RefreshCw size={16} />
              <span>Reset Filters</span>
            </button>
          ) : (
            <button onClick={handleOpenCreateModal} className="btn btn-primary">
              <Plus size={18} />
              <span>Create your first note</span>
            </button>
          )}
        </div>
      ) : (
        /* Notes Content */
        <div>
          {/* Pinned notes section */}
          {pinnedNotes.length > 0 && (
            <div style={{ marginBottom: '2.5rem' }}>
              <div className="section-label">
                <Pin size={14} />
                <span>Pinned Notes ({pinnedNotes.length})</span>
              </div>
              <div className="notes-grid">
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onEdit={handleOpenEditModal}
                    onDelete={handleOpenDeleteModal}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular notes section */}
          {regularNotes.length > 0 && (
            <div>
              {pinnedNotes.length > 0 && (
                <div className="section-label">
                  <FileText size={14} />
                  <span>Other Notes ({regularNotes.length})</span>
                </div>
              )}
              <div className="notes-grid">
                {regularNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onEdit={handleOpenEditModal}
                    onDelete={handleOpenDeleteModal}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Note Form Modal (Create / Edit) */}
      <NoteFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        noteToEdit={noteToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        noteToDelete={noteToDelete}
      />
    </div>
  );
};

export default DashboardPage;
