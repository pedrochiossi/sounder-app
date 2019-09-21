
const song = document.getElementById('song');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');

function playPause() {
  if (song.paused || song.currentTime === 0) {
    playIcon.classList.remove('hidden');
    song.play();
    setTimeout(() => {
      playIcon.classList.add('hidden');
    }, 500);
  } else {
    pauseIcon.classList.remove('hidden');
    song.pause();
    setTimeout(() => {
      pauseIcon.classList.add('hidden');
    }, 500);
  }
}