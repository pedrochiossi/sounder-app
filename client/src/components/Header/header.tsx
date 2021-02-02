import React, { useContext } from 'react';
import logo from '../../Assets/images/sounder_app_logo.png';
import QueueMusicIcon from '@material-ui/icons/QueueMusic';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import MenuIcon from '@material-ui/icons/Menu';
import Dropdown from '../Dropdown';
import { Link } from 'react-router-dom';
import './header.scss';
import { UserContext } from '../../context/user';

interface UserProps {
  name: string;
  imageURL: string;
}

const Header : React.FC<UserProps> = ({ name, imageURL }) => {

  const { logout } = useContext(UserContext);

  return (
    <nav className="navbar-container">
      <div className="list-menu-item">
        <Link to="/">
          <img className="icon-gap" src={logo} alt="logo" />
          Sounder
        </Link>
      </div>
      <div className="item-menu w3-hide-small">
        <div className="list-menu-item">
          <Link to="/playlists">
            <QueueMusicIcon />
            Playlists
          </Link>
        </div>
        <div className="list-menu-item">
          <Link to="/tracks">
            <MusicNoteIcon />
            Liked Tracks
          </Link>
        </div>
        <div className="list-menu-item">
          <Dropdown
            triggerContent={
              <>
                <img className="icon-gap" src={imageURL} alt="user"/>
                {name}
              </>
            }
          >
            <button className="dropdown-link" onClick={logout}>Logout</button>
          </Dropdown>
        </div>
      </div>
      <div className="w3-right w3-hide-large w3-hide-medium">
        <Dropdown
          triggerContent={
            <>
              <MenuIcon />
              <img className="icon-gap img-avatar" src={imageURL} alt="user" />
            </>
          }
        >
          <Link className="dropdown-link" to="/playlists"><QueueMusicIcon className="icon-gap" />Playlists</Link>
          <Link className="dropdown-link" to="/tracks"><MusicNoteIcon className="icon-gap" />Liked Tracks</Link>
          <button className="dropdown-link" onClick={logout}><PersonOutlineIcon className="icon-gap" />{`Logout of ${name}`}</button>
        </Dropdown>
      </div>
    </nav>
  )
}

export default Header;
