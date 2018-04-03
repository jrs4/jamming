import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {'searchInput': ''};
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleClick(e) {
    this.props.onSearch(this.state.searchInput);
  }

  handleChange(e) {
    this.setState({'searchInput': e.target.value});
  }

  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album or Artist" onChange={this.handleChange} />
        <a onClick={this.handleClick} >SEARCH</a>
      </div>
    );
  }
}

export default SearchBar;
