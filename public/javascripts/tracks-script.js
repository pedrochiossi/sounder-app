const songs = document.querySelectorAll('.audio-preview');
const albums = document.querySelectorAll('.album');
const playlistButton = document.getElementById('add-playlist-button');

playlistButton.onclick = () => {
  window.localStorage.clear();
};

window.onload = () => {
  const trackButtons = document.querySelectorAll('.add-track-button');
  trackButtons.forEach((button,i) => {
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
  if (window.localStorage.length > 0) {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const index = window.localStorage.key(i);
      trackButtons[index].innerText = window.localStorage.getItem(index);
      trackButtons[index].setAttribute('disabled', true);
    }
  }
};

albums.forEach((album, i) => {
  album.onmouseenter = () => {
    songs[i].play();
  };

  album.onmouseout = () => {
    songs[i].pause();
  };
});

function showOptions() {
  const options = document.getElementById('user-options');
  options.classList.toggle('w3-show');
}


