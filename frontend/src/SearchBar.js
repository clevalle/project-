import React from 'react';
import './css/SearchBar.css';
/**
 * @return {oject} JSX
 */
function SearchBar() {
  const [searchValue] = React.useState('');
  return (
    <div className='searchbar__body'>
      <input
        className='searchbar'
        type='text'
        placeholder='Search for emails'
        value={searchValue}
        // onChange={updateList}
      />
    </div>
  );
}

export default SearchBar;
