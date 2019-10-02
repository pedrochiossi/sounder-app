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