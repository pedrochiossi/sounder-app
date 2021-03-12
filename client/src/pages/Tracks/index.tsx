/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet';
import {
  TextField,
  Button,
  Fab,
  Snackbar,
  SvgIcon,
  Tooltip,
  List,
} from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import { ReactComponent as SpotifyIcon } from '../../Assets/images/spotify.svg';
import Loader from '../../components/Loader';
import api from '../../services/api';
import TrackListItem from '../../components/TrackListItem';
import './tracks.scss';

interface Alert {
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error' | undefined;
  visible: boolean;
}

interface Image {
  height: number;
  url: string;
  width: number;
}

interface Artist {
  name: string;
}

interface Track {
  _id: string;
  name: string;
  preview_url: string;
  album: {
    name: string;
    images: Image[];
  };
  artists: Artist[];
  spotify_id: string;
  savedOnSpotify: boolean;
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#14BEF0',
    },
    type: 'dark',
  },
});

const Tracks: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>();
  const [loading, setLoading] = useState(true);
  const [playlistName, setPlaylistName] = useState('');
  const [alert, setAlert] = useState<Alert>({
    message: '',
    visible: false,
  });
  const audioRef = useRef<Array<HTMLAudioElement | null>>([]);

  const fetchTracks = useCallback(async () => {
    setLoading(true);
    const response = await api.get('/tracks/liked');
    if (response.status === 200) {
      setTracks(response.data.tracks);
    }
    setLoading(false);
  }, []);

  const handlePlaylistSubmit = async (
    e: React.ChangeEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setLoading(true);
    const response = await api.post('/playlists/spotify/add', {
      playlist_name: playlistName,
    });
    if (response.status === 200) {
      setAlert({
        type: 'success',
        message: response.data.message,
        visible: true,
      });
      fetchTracks();
    } else {
      setAlert({
        type: 'error',
        message: response.data.message,
        visible: true,
      });
    }
    setLoading(false);
  };

  const handleClose = (_: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert({
      ...alert,
      visible: false,
    });
  };

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  useEffect(() => {
    if (tracks?.length) {
      audioRef.current = audioRef.current.slice(0, tracks.length);
    }
  }, [tracks]);

  return (
    <div className="tracks-container">
      <Helmet>
        <title>My Tracks</title>
      </Helmet>
      {loading && <Loader />}
      <Snackbar
        open={alert.visible}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity={alert.type}
        >
          {alert.message}
        </MuiAlert>
      </Snackbar>
      <div className="tracks-header">
        <h1 className="tracks-title">My Tracks</h1>
        <form onSubmit={handlePlaylistSubmit}>
          <ThemeProvider theme={theme}>
            <TextField
              name="playlist_name"
              className="playlist-name"
              placeholder="New playlist name"
              required
              label="New Playlist"
              value={playlistName}
              onChange={e => setPlaylistName(e.target.value)}
            />
          </ThemeProvider>
          <Button disabled={loading} type="submit" id="add-playlist-button">
            Add to Spotify
            <SvgIcon component={SpotifyIcon} />
          </Button>
          <Tooltip
            aria-label="add to spotify"
            title="Add to spotify"
            placement="top"
          >
            <Fab type="submit" id="add-playlist-button-mobile">
              <SvgIcon component={SpotifyIcon} />
            </Fab>
          </Tooltip>
        </form>
      </div>
      <List>
        {tracks?.map(track => (
          // eslint-disable-next-line no-underscore-dangle
          <TrackListItem key={track._id} track={track} />
        ))}
      </List>
    </div>
  );
};

export default Tracks;
