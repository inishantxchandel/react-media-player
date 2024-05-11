import React from "react";
import {
  CirclePause,
  CirclePlay,
  SkipForward,
  Maximize2,
  Minimize2,
  Minimize,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

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
  className?: string;
}

const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  togglePlay,
  skipTime,
  previousMedia,
  nextMedia,
  handleRateChange,
  toggleFullScreen,
  className,
  currentTime,
  duration,
  volume,
  handleVolumeChange,
  playbackRate,
  toggleMiniPlayer,
}) => {
  const buttons: ButtonProps[] = [
    {
      label: isPlaying ? "" : "",
      onClick: togglePlay,
      icon: isPlaying ? <CirclePause /> : <CirclePlay />,
    },
    { label: "-10s", onClick: () => skipTime(-10) },
    { label: "+10s", onClick: () => skipTime(10) },
    { label: "", onClick: toggleMiniPlayer, icon: <Minimize /> },
    { label: "", onClick: toggleFullScreen, icon: <Maximize2 /> },
    {
      label: "",
      onClick: previousMedia,
      icon: <SkipForward className="rotate-180" />,
    },
    { label: "", onClick: nextMedia, icon: <SkipForward /> },
  ];

  const intervals = [
    0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4,
  ];

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div
      className={cn(
        "controls p-4 bg-gray-200 flex items-center justify-between flex-wrap",
        className
      )}
    >
      {buttons.map((button, index) => (
        <button
          key={index}
          className="text-blue-500 py-2 px-4 rounded-md flex flex-wrap"
          onClick={button.onClick}
        >
          {button.icon && button.icon}
          {button.label}
        </button>
      ))}
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={(e) => handleVolumeChange(Number(e.target.value))}
        className="mx-2"
      />
      <select
        value={playbackRate}
        onChange={(e) => handleRateChange(parseFloat(e.target.value))}
        className="mx-2 bg-white border border-gray-300 rounded-md px-4 py-2"
      >
        {intervals.map((rate) => (
          <option key={rate} value={rate}>
            {rate}x
          </option>
        ))}
      </select>
      <div className="text-white px-2 py-4">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
};

export default Controls;
