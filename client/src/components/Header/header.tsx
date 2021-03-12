import React from 'react';
import { QueueMusic, MusicNote, PersonOutline, Menu } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import Dropdown from '../Dropdown';
import logo from '../../Assets/images/sounder_app_logo.png';
import './header.scss';
import { useUserContext } from '../../context/user';

const Header: React.FC = () => {
  const { logout, isSignedIn, user } = useUserContext();

  return isSignedIn ? (
    <nav className="navbar-container">
      <div className="list-menu-item">
        <Link to="/discovery">
          <img className="icon-gap" src={logo} alt="logo" />
          Sounder
        </Link>
      </div>
      <div className="item-menu w3-hide-small">
        <div className="list-menu-item">
          <Link to="/playlists">
            <QueueMusic />
            Playlists
          </Link>
        </div>
        <div className="list-menu-item">
          <Link to="/tracks">
            <MusicNote />
            Liked Tracks
          </Link>
        </div>
        <div className="list-menu-item">
          <Dropdown
            triggerContent={
              <>
                <img className="icon-gap" src={user?.imageURL} alt="user" />
                {user?.name}
              </>
            }
          >
            <button type="button" className="dropdown-link" onClick={logout}>
              Logout
            </button>
          </Dropdown>
        </div>
      </div>
      <div className="w3-right w3-hide-large w3-hide-medium">
        <Dropdown
          triggerContent={
            <>
              <Menu />
              <img
                className="icon-gap img-avatar"
                src={user?.imageURL}
                alt="user"
              />
            </>
          }
        >
          <Link className="dropdown-link" to="/playlists">
            <QueueMusic className="icon-gap" />
            Playlists
          </Link>
          <Link className="dropdown-link" to="/tracks">
            <MusicNote className="icon-gap" />
            Liked Tracks
          </Link>
          <button type="button" className="dropdown-link" onClick={logout}>
            <PersonOutline className="icon-gap" />
            {`Logout of ${user?.name}`}
          </button>
        </Dropdown>
      </div>
    </nav>
  ) : null;
};

export default Header;
