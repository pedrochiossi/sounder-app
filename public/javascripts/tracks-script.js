const songs = document.querySelectorAll('.audio-preview');
const albums = document.querySelectorAll('.album');

albums.forEach((album, i) => {
  album.onmouseenter = () => {
    songs[i].play();
  };

  album.onmouseout = () => {
    songs[i].pause();
  };
});
