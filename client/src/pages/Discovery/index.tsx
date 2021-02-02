import React, { useEffect, useState, useCallback, useContext } from 'react';
import api from '../../services/api';
import { UserContext } from '../../context/user';
import './discovery.scss'

interface Track {
  name: string;
  spotify_id: string;
  preview_url: string;
  artists: object[];
  album: object;
};

const Discovery: React.FC  = () => {

  const [track, setTrack] = useState<Track>();
  const { user } = useContext(UserContext);

  const fetchTrack = useCallback(async () => {
    const response = await api.get('/tracks/new');
    if (response.status === 200) {
      const { track } = response.data;
      setTrack(track);
    }
  },[])

  useEffect(() => {
    fetchTrack();
  },[user, fetchTrack])

  return (
    <div className="track-container">
      <span>{track && track.name}</span>
    </div>
  )
}

export default Discovery;

