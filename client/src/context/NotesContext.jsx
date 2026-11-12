import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient.js';
import { useAuth } from './AuthContext.jsx';

const NotesContext = createContext(null);

export const CATEGORIES = ['All', 'Work', 'Personal', 'Ideas', 'Projects', 'Finance', 'General'];

export const NotesProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch all notes for the authenticated user
  const fetchNotes = useCallback(async (search = searchTerm, category = selectedCategory) => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const params = {};
      if (search && search.trim()) params.search = search.trim();
      if (category && category !== 'All') params.category = category;

      const res = await axiosClient.get('/api/notes', { params });
      setNotes(res.data.notes || []);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      setError(err.message || 'Could not load your notes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, searchTerm, selectedCategory]);

  // Initial load and reload when user authenticates
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
    } else {
      setNotes([]);
      setSearchTerm('');
      setSelectedCategory('All');
    }
  }, [isAuthenticated]);

  // Create new note
  const createNote = async (noteData) => {
    setError(null);
    try {
      const res = await axiosClient.post('/api/notes', noteData);
      const newNote = res.data.note;
      // Prepend or re-sort
      setNotes((prev) => [newNote, ...prev].sort((a, b) => {
        if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      }));
      return { success: true, note: newNote };
    } catch (err) {
      const msg = err.message || 'Failed to create note.';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Update existing note
  const updateNote = async (id, updatedFields) => {
    setError(null);
    try {
      const res = await axiosClient.put(`/api/notes/${id}`, updatedFields);
      const updatedNote = res.data.note;

      setNotes((prev) =>
        prev
          .map((n) => (n._id === id ? updatedNote : n))
          .sort((a, b) => {
            if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1;
            return new Date(b.updatedAt) - new Date(a.updatedAt);
          })
      );
      return { success: true, note: updatedNote };
    } catch (err) {
      const msg = err.message || 'Failed to update note.';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    setError(null);
    try {
      await axiosClient.delete(`/api/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      return { success: true };
    } catch (err) {
      const msg = err.message || 'Failed to delete note.';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Toggle note pinned status
  const togglePin = async (id) => {
    const target = notes.find((n) => n._id === id);
    if (!target) return;
    return updateNote(id, { isPinned: !target.isPinned });
  };

  // Computed values
  const pinnedNotes = notes.filter((n) => n.isPinned);
  const regularNotes = notes.filter((n) => !n.isPinned);

  return (
    <NotesContext.Provider
      value={{
        notes,
        pinnedNotes,
        regularNotes,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        fetchNotes,
        createNote,
        updateNote,
        deleteNote,
        togglePin,
        totalCount: notes.length,
        pinnedCount: pinnedNotes.length,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export default NotesContext;
