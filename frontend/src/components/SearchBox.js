import React, { useState } from 'react';

const SearchBox = ({ history }) => {
  const [ keyword, setKeyword ] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    if(keyword.trim()) {
      history.push(`/search/${keyword}`);
    } else {
      history.push('/');
    }
  }



  return (
    <form onSubmit={submitHandler}>
      <input
          type="text"
          id="inputText"
          className="navbar_search_input"
          placeorder="Search Product"
          onChange={(e) => setKeyword(e.target.value)}
          placeholder='Search Products...'
      />
    </form>
  )
}

export default SearchBox;
