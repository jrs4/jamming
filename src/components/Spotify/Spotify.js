const client_id = 'db0b10ceb4d44fbeae1e3421dba7bf4c'; // Your client id
const redirect_uri = 'http://jrs4-spotify.surge.sh/'; // Your redirect uri
//const redirect_uri = 'http://localhost:3000'; // Your redirect uri

const Spotify = {
  generateRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  },

  login() {
    const scope = 'user-read-private user-read-email playlist-modify-public';
    const state = this.generateRandomString(16);
    const url = 'https://accounts.spotify.com/authorize?' +
                  'response_type=token' +
                  '&client_id=' + client_id +
                  '&scope=' + encodeURIComponent(scope) +
                  '&redirect_uri=' + encodeURIComponent(redirect_uri) +
                  '&state=' + state;
    window.location = url;
  },

  search(input, accessToken) {
    let tracks = [];
    const url = 'https://api.spotify.com/v1/search?' +
                'type=track' +
                '&q=' + encodeURIComponent(input);

    return fetch(url, {
          method: 'GET',
          headers: { Authorization: 'Bearer ' + accessToken }
        }).then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Request failed!');
          }, networkError => console.log(networkError.message)
        ).then(jsonResponse => {
          console.log(jsonResponse);
          if(jsonResponse.tracks) {
            jsonResponse.tracks.items.map(track => {
              return tracks.push({
                id: track.id,
                song: track.name,
                album: track.album.name,
                artist: track.artists[0].name,
                uri: track.uri
              });
            });
          };
          return tracks;
        });
  },

  savePlaylist(playlistName, playlistURIs, accessToken) {
    this.getUserId(accessToken).then(userId => {
      console.log(userId);
      this.createNewPlaylist(userId, playlistName, accessToken).then(playlistId => {
        console.log(playlistId);
        this.addTracksToPlaylist(userId, playlistId, playlistURIs, accessToken).then( response => {
          console.log(response);
        });
      });
    });
  },

  getUserId(accessToken) {
    const urlGetId = 'https://api.spotify.com/v1/me';
    return fetch(urlGetId, {
          method: 'GET',
          headers: { Authorization: 'Bearer ' + accessToken }
      }).then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Request failed!');
        }, networkError => console.log(networkError.message)
      ).then(jsonResponse => {
        return jsonResponse.id
      });    
  },

  createNewPlaylist(userId, playlistName, accessToken) {
    const urlCreatePlaylist = 'https://api.spotify.com/v1/users/' + userId + '/playlists';
    return fetch(urlCreatePlaylist, {
          method: 'POST',
          headers: { 
            Authorization: 'Bearer ' + accessToken,
            'Content-type': 'application/json'
           },
           body: JSON.stringify({name: playlistName})
      }).then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Request failed!');
        }, networkError => console.log(networkError.message)
      ).then(jsonResponse => {
        return jsonResponse.id;
      });
  },

  addTracksToPlaylist(userId, playlistId, playlistURIs, accessToken) {
    const urlAddTracksToPlaylist = 'https://api.spotify.com/v1/users/' + userId + '/playlists/' + playlistId + '/tracks';
    return fetch(urlAddTracksToPlaylist, {
          method: 'POST',
          headers: { 
            Authorization: 'Bearer ' + accessToken,
            'Content-type': 'application/json'
           },
           body: JSON.stringify({uris: playlistURIs})
      }).then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Request failed!');
        }, networkError => console.log(networkError.message)
      ).then(jsonResponse => {
        return jsonResponse;
      });
  }
};

export default Spotify;