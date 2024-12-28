import React from "react";
import SearchIcon from "./SearchIcon";

const Search = ({ handleSearchChange }) => {
  return (
    <div className="search-box-container">
      <input
        type="text"
        placeholder="Search"
        className="search-box"
        onChange={handleSearchChange}
      />
      <SearchIcon />
    </div>
  );
};

export default Search;
