function modalDeletePlaylist(playlistId) {
  document.getElementById('myModal').innerHTML = `
  <div class="w3-modal-content w3-card-4">
    <header class="w3-container modal-color-custom"> 
      <span onclick="document.getElementById('myModal').style.display='none'" 
      class="w3-button w3-display-topright">&times;</span>
      <h2>Delete Playlist?</h2>
    </header>
    <div class="w3-container w3-black">

      <div class="modal-container-custom">
      <button class="confirm-delete-btn" onclick="deleteOnePlaylist('${playlistId}')">Confirm</button>
      <button class="cancel-delete-btn" onclick="document.getElementById('myModal').style.display='none'">Cancel</button>
      </div>
    </div>
    <footer class="w3-container modal-color-custom">
      <p></p>
    </footer>
  </div>
  `;
  document.getElementById('myModal').style.display = 'block';
}

async function deleteOnePlaylist(id) {
  document.getElementById('myModal').style.display = 'none';
  const updatedPlaylist = await axios.post('/playlists/api/delete', { playlistId: id });
  const { playlists } = updatedPlaylist.data;

  document.getElementById('list-of-playlists').innerHTML = '';

  playlists.forEach((playlist) => {
    document.getElementById('list-of-playlists').innerHTML += `
        <li class="w3-bar">
          <div class="w3-bar-item">
            <div class="playlist-cover">
             
              <img src="${playlist.images[0]}" width="40px" height="40px" />
              <img src="${playlist.images[1]}" width="40px" height="40px" />
              <img src="${playlist.images[2]}" width="40px" height="40px" />
              <img src="${playlist.images[3]}" width="40px" height="40px" />

            </div>
          </div>
          <div class="playlist-info w3-bar-item">
            <span class="w3-large">${playlist.name}</span>
          </div>
          <div class="track-link w3-bar-item w3-right ">
            <button onclick="modalDeletePlaylist('${playlist._id}')" title="Delete this playlist"
            class="delete-btn material-icons md-light">delete_forever</button>
            <a href="https://open.spotify.com/playlist/${playlist.spotify_id}" target="_blank"><i
                class="material-icons md-18">play_circle_outline</i></a>
          </div>
        </li>
        `;
  });
}

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


// <a href="/playlists/delete/${el.target.value}"><i class="delete-btn material-icons md-18">delete_forever</i> Confirm</a>
