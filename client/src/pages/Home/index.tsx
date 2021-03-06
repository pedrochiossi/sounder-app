import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { SvgIcon, CircularProgress } from '@material-ui/core';
import logo from '../../Assets/images/sounder_app_logo.png';
import sounderPreview from '../../Assets/images/sounder-preview-img.png';
import { ReactComponent as SpotifyIcon } from '../../Assets/images/spotify.svg';
import { useUserContext } from '../../context/user';
import './home.scss';

const Home: React.FC = () => {
  const [loadingSpotify, setLoadingSpotify] = useState(false);
  const { isSignedIn } = useUserContext();
  const handleClick = () => {
    setLoadingSpotify(true);
  };

  return isSignedIn ? (
    <Redirect to="/discovery" />
  ) : (
    <section className="bg-dark home-section">
      <div className="home-container">
        <div className="info-wrap">
          <div className="logo">
            <h1>Sounder</h1>
            <img src={logo} alt="sounder-logo" />
          </div>
          <h2>A new way of discovering the song you love</h2>
          <p>
            With Sounder app you can quickly discover new songs based on your
            Spotify saved tracks library. With an intuitive flow, you can hear
            new recomendations and personalize them even more by giving a like
            or dislike. You can also add your liked tracks to a new Spotify and
            listen to them on your Spotify account.
          </p>
          <div className="img-wrap mobile-visible">
            <img src={sounderPreview} alt="Sounder" />
          </div>
          <div className="home-btn">
            <a onClick={handleClick} href="/api/auth/spotify">
              {loadingSpotify ? (
                <CircularProgress color="inherit" />
              ) : (
                <SvgIcon component={SpotifyIcon} />
              )}
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
};

export default Home;
