/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useRef } from 'react';
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  CircularProgress,
} from '@material-ui/core';
import {
  PlayArrow,
  Pause,
  FavoriteBorder,
  Favorite,
  OpenInNew,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import api from '../../services/api';
import './trackListItem.scss';

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
  savedOnSpotify?: boolean;
}

interface TrackProps {
  track: Track;
}

const useStyle = makeStyles({
  primary: {
    color: '#fff',
  },
  secondary: {
    color: '#999',
  },
});

const TrackListItem: React.FC<TrackProps> = ({ track }: TrackProps) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [spotifyLiked, setSpotifyLiked] = useState(() => track?.savedOnSpotify);
  const audioRef = useRef<HTMLAudioElement>(null);
  const classes = useStyle();

  const playPause = () =>
    isPlayingAudio ? audioRef?.current?.pause() : audioRef?.current?.play();

  const handleSpotifyLike = async (id: string) => {
    setLoadingLike(true);
    const response = await api.post(
      `/tracks/spotify/${spotifyLiked ? 'dislike' : 'like'}`,
      {
        spotifyId: id,
      },
    );
    if (response.status === 200) {
      setSpotifyLiked(!spotifyLiked);
    }
    setLoadingLike(false);
  };

  return (
    <ListItem divider>
      <ListItemAvatar>
        <Avatar onClick={playPause}>
          <img src={track.album.images[2].url} alt={track.album.name} />
          <PlayArrow
            className={`play-control ${isPlayingAudio ? '' : 'active'}`}
          />
          <Pause
            className={`pause-control ${isPlayingAudio ? 'active' : ''}`}
          />
          <audio
            onEnded={() => setIsPlayingAudio(false)}
            onPlay={() => setIsPlayingAudio(true)}
            onPause={() => setIsPlayingAudio(false)}
            ref={audioRef}
            src={track.preview_url}
          />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        classes={{
          primary: classes.primary,
          secondary: classes.secondary,
        }}
        primary={track.name}
        secondary={`${track.artists[0].name} - ${track.album.name}`}
      />
      <ListItemSecondaryAction>
        {loadingLike && (
          <CircularProgress size={18} style={{ color: 'white' }} />
        )}
        <Tooltip title="Like song on Spotify" placement="top">
          {spotifyLiked ? (
            <Favorite
              className="favorite-icon liked"
              onClick={() => handleSpotifyLike(track.spotify_id)}
            />
          ) : (
            <FavoriteBorder
              className="favorite-icon"
              onClick={() => handleSpotifyLike(track.spotify_id)}
            />
          )}
        </Tooltip>
        <Tooltip title="Open song on Spotify" placement="top">
          <a
            href={`https://open.spotify.com/track/${track.spotify_id}`}
            target="_blank"
            rel="noreferrer"
          >
            <OpenInNew className="link-icon" />
          </a>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default TrackListItem;
