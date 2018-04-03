import React from 'react';
import TrackList from '../TrackList/TrackList';
import './SearchResults.css';

class SearchResults extends React.Component {
  render() {
    return (
        <div className="SearchResults">
          <h2>Results</h2>
          <TrackList
            TrackList={this.props.TrackList}
            isRemoval='false'
            onAdd={this.props.onAdd}
          />
        </div>
    );
  }
}

export default SearchResults;
