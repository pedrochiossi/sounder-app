import React, { useState } from 'react';
import logo from 'Assets/images/sounder_app_logo.png';
import sounderPreview from 'Assets/images/sounder-preview-img.png';
import { ReactComponent as SpotifyIcon } from 'Assets/images/spotify.svg';
import { SvgIcon, CircularProgress } from '@material-ui/core';
import './home.scss';


const Home = () => {

  const [loadingSpotify, setLoadingSpotify] = useState(false);

  const handleClick = () => {
    setLoadingSpotify(true);
  }

  return  (
    <section className="bg-dark home-small">
      <div className="home-container">
        <div className="info-wrap">
          <div className="logo">
            <h1>Sounder</h1>
            <img src={logo} alt="sounder-logo" /> 
          </div>
          <h2>A new way of discovering the song you love</h2>
          <p>
            With Sounder app you can quickly discover new songs based on your Spotify liked tracks library. With an intuitive flow, you can
            hear new recomendations and personalize it even more by liking or disliking it. After that, just add it to a
            new playlist and listen in your Spotify account.
          </p>
          <div className="img-wrap mobile-visible">
            <img src={sounderPreview} alt="Sounder" />
          </div>
          <div className="home-btn">
            <a onClick={handleClick} href="/api/auth/spotify">
              {loadingSpotify ? <CircularProgress color="inherit" /> : <SvgIcon component={SpotifyIcon} />}
              {loadingSpotify ? '' : 'Login With Spotify'}
            </a>
          </div>
        </div>
        <div className="img-wrap desktop-visible">
         <img src={sounderPreview} alt="Sounder" />
        </div>
      </div>
    </section>
  );
}

export default Home;
