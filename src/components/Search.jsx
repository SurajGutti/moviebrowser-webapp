import React from "react";
import searchIcon from "./images/search.svg";

const Search = ({ searchMovie, setSearchMovie }) => {
  return (
    <>
      <div className="search">
        <div></div>
        <img src={searchIcon} />
        <input
          type="text"
          placeholder="Search through thousands of movies"
          value={searchMovie}
          onChange={(e) => setSearchMovie(e.target.value)}
        />
      </div>
    </>
  );
};

export default Search;
