import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  Fragment,
} from 'react';
import api from '../../services/api';
import { UserContext } from '../../context/user';
import Player from '../../components/Player';
import './discovery.scss';

interface Image {
  height: number;
  url: string;
  width: number;
}

interface Track {
  preview_url: string;
  album: {
    images: Image[];
  };
}

const Discovery: React.FC = () => {
  const [track, setTrack] = useState<Track>();
  const [trackColor, setTrackColor] = useState('');
  const { user } = useContext(UserContext);

  const fetchTrack = useCallback(async () => {
    const response = await api.get('/tracks/new');
    if (response.status === 200) {
      const { track: fetchedTrack, colors } = response.data;
      setTrack(fetchedTrack);
      setTrackColor(colors);
    }
  }, []);

  useEffect(() => {
    fetchTrack();
  }, [user, fetchTrack]);

  return (
    <Fragment>
      <div className="discovery-container">
        <div
          style={{
            background: track
              ? `url(${track.album.images[0].url}) 0 / cover fixed`
              : '',
          }}
          id="bg-before"
        ></div>
        <div id="bg"></div>
        {track && <Player track={track} color={trackColor} />}
      </div>
    </Fragment>
  );
};

export default Discovery;
