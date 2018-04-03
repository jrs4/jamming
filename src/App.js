import React, { Component } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';
import Spotify from './components/Spotify/Spotify';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'searchResults': [],
      'playlist': [],
      'playlistName' : 'New Playlist',
      'accessToken' : '',
      'expiresIn' : ''
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.idMatch = this.idMatch.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.searchSpotify = this.searchSpotify.bind(this);
    this.checkUrlAccessToken = this.checkUrlAccessToken.bind(this);
    this.savePlaylistToSpotify = this.savePlaylistToSpotify.bind(this);
  }

  idMatch(track) {
    let result = 'NULL';
    this.state.playlist.map((currentTrack, index) => {
      if (currentTrack.id === track.id) {
        result = index;
      }
      return result;
    });
    return result;
  }

  addTrack(track) {
    let idToCheck = this.idMatch(track);
    if (idToCheck === 'NULL') {
      let newPlaylist = this.state.playlist;
      newPlaylist.push(track);
      this.setState({
        'playlist': newPlaylist
      });
    }
  }

  removeTrack(track) {
    let idToRemove = this.idMatch(track);
    if (idToRemove !== 'NULL') {
      let newPlaylist = this.state.playlist;
      newPlaylist.splice(idToRemove, 1);
      this.setState({
        'playlist': newPlaylist
      });
    }
  }

  updatePlaylistName(playlistName) {
    this.setState({'playlistName': playlistName});
  }

  checkUrlAccessToken(login) {
    return new Promise((resolve, reject) => {
      if (this.state.accessToken === '') {
        if (window.location.href.match(/access_token=([^&]*)/)) {
          const token = window.location.href.match(/access_token=([^&]*)/)[1];
          const expires = window.location.href.match(/expires_in=([^&]*)/)[1];
          window.history.pushState('Access Token', null, '/');

          this.setState({'accessToken': token, 'expiresIn': expires});
          resolve('Access Token');
        } else {
          if (login === true) {
            Spotify.login();
          }
          resolve(false);
        }
      } else {
        resolve('Access Token');
      }
    });
  }

  searchSpotify(input) {
    this.checkUrlAccessToken(true).then(response => {
      if (response === 'Access Token' && input !== '') {
        Spotify.search(input, this.state.accessToken).then(response => {
          this.setState({searchResults: response});
        });
      }
    }); 
  }

  savePlaylistToSpotify() {
    if(this.state.playlist !== []) {
      let trackURIs = [];
      this.state.playlist.map(track => {
        return trackURIs.push(track.uri);
      });
      Spotify.savePlaylist(this.state.playlistName, trackURIs, this.state.accessToken);
      this.setState({playlist:[], playlistName:'New Playlist'});
    }
  }

  componentDidMount() {
    this.checkUrlAccessToken(false);
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.searchSpotify} />
          <div className="App-playlist">
            <SearchResults
              TrackList={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist
              TrackList={this.state.playlist}
              PlaylistName={this.state.playlistName}
              onRemove={this.removeTrack}
              onPlaylistNameChange={this.updatePlaylistName}
              onSave={this.savePlaylistToSpotify}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;