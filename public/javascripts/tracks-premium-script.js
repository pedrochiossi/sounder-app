const playlistButton = document.getElementById('add-playlist-button');

playlistButton.onclick = () => {
  window.localStorage.clear();
};

window.onload = () => {
  const trackButtons = document.querySelectorAll('.add-track-button');
  trackButtons.forEach((button, i) => {
    button.onclick = (e) => {
      axios.post('/tracks/api/add-to-spotify', { spotifyId: e.target.value })
        .then(() => {
          button.innerText = 'done';
          button.setAttribute('disabled', true);
          window.localStorage.setItem(`${i}`, 'done');
        })
        .catch(err => console.log(err));
    };
  });
  if (window.localStorage.length > 1) {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const index = window.localStorage.key(i);
      trackButtons[index].innerText = window.localStorage.getItem(index);
      trackButtons[index].setAttribute('disabled', true);
    }
  }
};


window.onSpotifyWebPlaybackSDKReady = () => {
  const player = new Spotify.Player({
    name: 'SounderApp Player',
    getOAuthToken: async (cb) => {
      const response = await axios.get('api/user');
      cb(response.data.user.access_token);
    },
    volume: 0.8,
  });
    // Error handling
  player.addListener('initialization_error', ({ message }) => { console.error(message); });
  player.addListener('authentication_error', ({ message }) => { console.error(message); });
  player.addListener('account_error', ({ message }) => { console.error(message); });
  player.addListener('playback_error', ({ message }) => { console.error(message); });

  // Playback status updates
  player.addListener('player_state_changed', state => { console.log(state); });

  // Ready
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
  });

  // Not Ready
  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id);
  });

  // Connect to the player!
  player.connect();
};

function showOptions() {
  const options = document.getElementById('user-options');
  options.classList.toggle('w3-show');
}

function dropdownMenu() {
  const x = document.getElementById('dropdowm-menu');
  if (x.className.indexOf('w3-show') === -1) {
    x.className += ' w3-show';
  } else {
    x.className = x.className.replace(' w3-show', '');
  }
}

