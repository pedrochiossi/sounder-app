/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Clear, Favorite } from '@material-ui/icons';
import { Fab } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import api from '../../services/api';
import { useUserContext } from '../../context/user';
import Player from '../../components/Player';
import Loader from '../../components/Loader';
import './discovery.scss';

const useStyles = makeStyles(() =>
  createStyles({
    dislikeFab: {
      marginRight: '100px',
      backgroundColor: '#e71d1d',
      '&:hover, &:focus': {
        backgroundColor: '#c40d0d',
      },
    },
    likeFab: {
      backgroundColor: '#0dd30d',
      '&:hover, &:focus': {
        backgroundColor: '#0c910c',
      },
    },
    icons: {
      color: '#fff',
      fontSize: '36px',
    },
  }),
);

interface Image {
  height: number;
  url: string;
  width: number;
}

interface Track {
  _id: string;
  name: string;
  preview_url: string;
  album: {
    name: string;
    images: Image[];
  };
  artists: [];
}

const Discovery: React.FC = () => {
  const [track, setTrack] = useState<Track>();
  const [trackColor, setTrackColor] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUserContext();
  const classes = useStyles();

  const fetchTrack = useCallback(async () => {
    setLoading(true);
    const response = await api.get('/tracks/new');
    if (response?.status === 200) {
      const { track: fetchedTrack, colors } = response.data;
      setTrack(fetchedTrack);
      setTrackColor(colors);
    }
    setLoading(false);
  }, []);

  const setLiked = useCallback(
    async liked => {
      if (!track) return;
      setLoading(true);
      const response = await api.patch('tracks/set-liked', {
        id: track._id,
        liked,
      });
      if (response.status === 200) {
        fetchTrack();
      }
    },
    [fetchTrack, track],
  );

  useEffect(() => {
    fetchTrack();
  }, [user, fetchTrack]);

  return (
    <>
      <Helmet>
        <title>Discovery</title>
      </Helmet>
      <div
        style={{
          background: track
            ? `url(${track.album.images[0].url}) 0 / cover fixed`
            : '',
        }}
        id="bg-before"
      />
      <div id="bg" />
      <div className="discovery-container">
        {loading && <Loader />}
        {track && (
          <>
            <Player track={track} color={trackColor} />
            <div className="buttons-container">
              <Fab
                className={classes.dislikeFab}
                onClick={() => setLiked('false')}
                size="large"
              >
                <Clear className={classes.icons} />
              </Fab>
              <Fab
                className={classes.likeFab}
                onClick={() => setLiked('true')}
                size="large"
              >
                <Favorite className={classes.icons} />
              </Fab>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Discovery;
