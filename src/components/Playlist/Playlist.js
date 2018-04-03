import React from 'react';
import TrackList from '../TrackList/TrackList';
import './Playlist.css';

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleChange(e) {
    this.props.onPlaylistNameChange(e.target.value);
  }

  handleSave(e) {
    this.props.onSave();
  }

  render() {
    return (
      <div className="Playlist">
        <input value={this.props.PlaylistName} onChange={this.handleChange} />
        <TrackList
          TrackList={this.props.TrackList}
          isRemoval='true'
          onRemove={this.props.onRemove}
        />
        <a className="Playlist-save" onClick={this.handleSave}>SAVE TO SPOTIFY</a>
      </div>
    );
  }
}

export default Playlist;