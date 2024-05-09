import React from "react";
import { CirclePause, CirclePlay, SkipForward, Maximize2, Minimize2, Minimize } from "lucide-react";

interface ControlsProps {
  isPlaying: boolean;
  togglePlay: () => void;
  skipTime: (time: number) => void;
  previousMedia: () => void;
  nextMedia: () => void;
  handleRateChange: (rate: number) => void;
  toggleFullScreen: () => void;
  toggleMiniPlayer: () => void;
  currentTime: number;
  duration: number;
  volume: number;
  handleVolumeChange: (volume: number) => void;
  playbackRate: number;
}

const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  togglePlay,
  skipTime,
  previousMedia,
  nextMedia,
  handleRateChange,
  toggleFullScreen,
  currentTime,
  duration,
  volume,
  handleVolumeChange,
  playbackRate,
  toggleMiniPlayer
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="controls p-4 bg-gray-200 flex items-center justify-between">
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md"
        onClick={togglePlay}
      >
        {isPlaying ? <CirclePause /> : <CirclePlay />}
      </button>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md"
        onClick={() => skipTime(-10)}
      >
        -10s
      </button>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md"
        onClick={() => skipTime(10)}
      >
        +10s
      </button>
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={(e) => handleVolumeChange(Number(e.target.value))}
        className="mx-2"
      />
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md"
        onClick={previousMedia}
      >
        <SkipForward className="rotate-180" />
      </button>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md"
        onClick={nextMedia}
      >
        <SkipForward />
      </button>

      <select
        value={playbackRate}
        onChange={(e) => handleRateChange(parseFloat(e.target.value))}
        className="mx-2 bg-white border border-gray-300 rounded-md px-2 py-1"
      >
        {[
          0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5,
          3.75, 4,
        ].map((rate) => (
          <option key={rate} value={rate}>
            {rate}x
          </option>
        ))}
      </select>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md"
        onClick={toggleMiniPlayer}
      >
        <Minimize />
      </button>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md"
        onClick={toggleFullScreen}
      >
        <Maximize2 />
      </button>

      <div className="text-white">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
};

export default Controls;
