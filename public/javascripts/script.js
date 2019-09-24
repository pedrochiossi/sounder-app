const song = document.getElementById('song');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const background = document.getElementById('bg-before');
const albumImg = document.getElementById('album-img');
const progressBar = document.getElementById('progress-bar');
progressBar.classList.add('play');
background.style.background = `url(${albumImg.getAttribute('src')}) 0 / cover fixed`;


song.onended = () => {
  progressBar.classList.remove('play');
  progressBar.offsetHeight;
  progressBar.classList.add('play');
  progressBar.style.animationPlayState = 'paused';
};


function playPause() {
  if (song.paused) {
    playIcon.classList.remove('hidden');
    song.play();
    progressBar.style.animationPlayState = 'running';
    setTimeout(() => {
      playIcon.classList.add('hidden');
    }, 500);
  } else {
    pauseIcon.classList.remove('hidden');
    song.pause();
    progressBar.style.animationPlayState = 'paused';
    setTimeout(() => {
      pauseIcon.classList.add('hidden');
    }, 500);
  }
}
