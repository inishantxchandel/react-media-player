import React from "react";
import {
  CirclePause,
  CirclePlay,
  SkipForward,
  Maximize2,
  Minimize,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { intervals } from "@/lib/constants";

// Interface for button properties
interface ButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

// Interface for control properties
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
  currentMediaIndex: number;
  mediaList: string[];
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
  currentMediaIndex,
  mediaList,
}) => {
  // Array of buttons with labels, onClick handlers, and icons
  const buttons: ButtonProps[] = [
    { label: "-10s", onClick: () => skipTime(-10) },
    { label: "+10s", onClick: () => skipTime(10) },
    { label: "", onClick: toggleMiniPlayer, icon: <Minimize /> }, // Toggle mini player button
    { label: "", onClick: toggleFullScreen, icon: <Maximize2 /> }, // Toggle fullscreen button
    {
      label: "",
      onClick: previousMedia,
      icon: (
        <SkipForward
          className={cn(
            "rotate-180",
            currentMediaIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
          )}
        />
      ),
    }, // Prev media button
    {
      label: "",
      onClick: togglePlay, // Toggle play/pause action
      icon: isPlaying ? <CirclePause /> : <CirclePlay />, // Play or pause icon based on the playback state
    },
    {
      label: "",
      onClick: nextMedia,
      icon: (
        <SkipForward
          className={cn(
            currentMediaIndex === mediaList.length - 1
              ? "opacity-50 cursor-not-allowed"
              : ""
          )}
        />
      ),
    }, // Next media button
  ];

  // Function to format time in MM:SS format
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
      {/* Render buttons */}
      {buttons.map((button, index) => (
        <button
          key={index}
          className="text-blue-500 py-2 px-4 rounded-md flex flex-wrap"
          onClick={button.onClick}
        >
          {button.icon && button.icon} {/* Render icon if available */}
          {button.label} {/* Render label */}
        </button>
      ))}
      {/* Volume control */}
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={(e) => handleVolumeChange(Number(e.target.value))}
        className="mx-2"
      />
      {/* Playback rate control */}
      <select
        value={playbackRate}
        onChange={(e) => handleRateChange(parseFloat(e.target.value))}
        className="mx-2 bg-white border border-gray-300 rounded-md px-4 py-2"
      >
        {/* Map playback rate options */}
        {intervals.map((rate) => (
          <option key={rate} value={rate}>
            {rate}x
          </option>
        ))}
      </select>
      {/* Display current time and duration */}
      <div className="text-blue-500 px-2 py-4">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
};

export default Controls;
