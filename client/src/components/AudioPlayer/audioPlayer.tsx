import React, { forwardRef } from 'react';

interface Props {
  color: string;
  track: {
    preview_url: string;
  };
}

const handleEnded = () => {};


const AudioPlayer = forwardRef<HTMLAudioElement, Props>((props, ref) => {
  const { color, track } = props;

  return (
    <>
      <div id="progress">
        <div
          className="paused"
          id="progress-bar"
          style={{ backgroundColor: `rgb(${color})` }}
        />
      </div>
      <div>
        <audio
          id="song"
          src={track.preview_url}
          onEnded={handleEnded}
          ref={ref}
        />
      </div>
    </>
  );
});

export default AudioPlayer;
