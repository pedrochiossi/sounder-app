import React, {
  useRef,
  Fragment,
  useCallback,
  useState,
  useEffect,
} from 'react';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import './player.scss';

interface Image {
  height: number;
  url: string;
  width: number;
}

interface Artist {
  name: string;
}

interface Props {
  color: string;
  track: {
    preview_url: string;
    album: {
      name: string;
      images: Image[];
    };
    name: string;
    artists: Artist[];
  };
}

const Player: React.FC<Props> = ({ color, track }: Props) => {
  const [animationPlayState, setAnimationPlayState] = useState('paused');
  const [playIconHidden, setPlayIconHidden] = useState(true);
  const [pauseIconHidden, setPauseIconHidden] = useState(true);
  const [restartAnimation, setRestartAnimation] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const { images } = track.album;

  const handleEnded = () => {
    setAnimationPlayState('paused');
    setRestartAnimation(true);
  };

  const playPause = useCallback(() => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      setPlayIconHidden(false);
      audioRef.current.play();
      setAnimationPlayState('running');
    } else {
      setPauseIconHidden(false);
      audioRef.current.pause();
      setAnimationPlayState('paused');
    }
  }, [audioRef]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!playIconHidden || !pauseIconHidden) {
      const timeout = setTimeout(() => {
        setPlayIconHidden(true);
        setPauseIconHidden(true);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [playIconHidden, pauseIconHidden]);

  useEffect(() => {
    if (restartAnimation) {
      setRestartAnimation(false);
    }
  }, [restartAnimation]);

  useEffect(() => {
    setAnimationPlayState('paused');
    setRestartAnimation(true);
  }, [track]);

  return (
    <Fragment>
      <div className="image-container">
        <img className="album-img" src={images[0].url} onClick={playPause} />
        <div className={`centered ${playIconHidden ? 'hidden' : ''}`}>
          <PlayArrowIcon style={{ color: 'white', fontSize: 100 }} />
        </div>
        <div className={`centered ${pauseIconHidden ? 'hidden' : ''}`}>
          <PauseIcon style={{ color: 'white', fontSize: 100 }} />
        </div>
        <div id="progress">
          <div className={restartAnimation ? '' : 'hidden'} />
          {!restartAnimation && (
            <div
              ref={progressBarRef}
              id="progress-bar"
              style={{ backgroundColor: `rgb(${color})`, animationPlayState }}
            />
          )}
        </div>
        <div className="song-info">
          <span className="song">{track.name}</span>
          <span className="artist">
            {track.artists[0].name} - {track.album.name}
          </span>
        </div>
        <div>
          <audio src={track.preview_url} onEnded={handleEnded} ref={audioRef} />
        </div>
      </div>
    </Fragment>
  );
};

export default Player;
