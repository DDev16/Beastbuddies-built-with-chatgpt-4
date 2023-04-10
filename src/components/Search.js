
import React from 'react';

const SearchBar = ({ setSearchQuery }) => {
  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by ID, Element or Name"
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;
