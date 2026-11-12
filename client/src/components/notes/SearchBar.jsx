import React from 'react';
import { Search, X } from 'lucide-react';
import { useNotes, CATEGORIES } from '../../context/NotesContext.jsx';

export const SearchBar = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    fetchNotes,
  } = useNotes();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Debounced or direct fetch
    fetchNotes(value, selectedCategory);
  };

  const clearSearch = () => {
    setSearchTerm('');
    fetchNotes('', selectedCategory);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    fetchNotes(searchTerm, category);
  };

  return (
    <div className="search-filter-section">
      <div className="search-box-wrapper">
        <Search size={18} className="input-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search by title or note contents..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="btn-icon"
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="category-chips">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => handleCategorySelect(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
