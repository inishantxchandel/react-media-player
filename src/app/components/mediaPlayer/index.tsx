"use client";
import {
  CirclePause,
  CirclePlay,
  Loader,
  Maximize2,
  SkipForward,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

interface MediaPlayerProps {
  mediaList: string[];
  initialMediaIndex?: number;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({
  mediaList,
  initialMediaIndex = 0,
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] =
    useState<number>(initialMediaIndex);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(100);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const mediaRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mediaRef?.current) {
      mediaRef.current.volume = volume / 100;
      mediaRef.current.playbackRate = playbackRate;
      mediaRef.current.addEventListener("timeupdate", updateTime);
      mediaRef.current.addEventListener("loadedmetadata", () => {
        setDuration(mediaRef.current?.duration || 0);
      });
      mediaRef.current.addEventListener("waiting", handleLoading);
      mediaRef.current.addEventListener("playing", handleLoaded);
    }
    return () => {
      if (mediaRef.current) {
        mediaRef.current.removeEventListener("timeupdate", updateTime);
        mediaRef.current.removeEventListener("waiting", handleLoading);
        mediaRef.current.removeEventListener("playing", handleLoaded);
      }
    };
  }, [volume, playbackRate, currentMediaIndex]);

  const updateTime = () => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
  };

  const skipTime = (time: number) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime += time;
    }
  };

  const nextMedia = () => {
    if (currentMediaIndex < mediaList.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    }
  };

  const previousMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    }
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const toggleFullScreen = () => {
    document.querySelector(".player");
    if (!isFullScreen) {
      if (mediaRef.current) {
        mediaRef.current.requestFullscreen();
      }
    } else {
      if (document.fullscreenElement === null) {
        mediaRef.current?.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  const handleLoading = () => {
    setIsLoading(true);
  };

  const handleLoaded = () => {
    setIsLoading(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      mediaRef.current?.pause();
    } else {
      mediaRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressRef.current;
    if (progressBar) {
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percent = (clickX / progressBar.offsetWidth) * 100;
      const currentTime = (percent / 100) * duration;
      if (mediaRef.current) {
        mediaRef.current.currentTime = currentTime;
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    setShowControls(true);
    switch (e.key) {
      case " ":
        togglePlay();
        break;
      case "ArrowUp":
        handleVolumeChange(Math.min(volume + 10, 100));
        break;
      case "ArrowDown":
        handleVolumeChange(Math.max(volume - 10, 0));
        break;
      case "ArrowRight":
        skipTime(10);
        break;
      case "ArrowLeft":
        skipTime(-10);
        break;
      case "m":
      case "M":
        handleVolumeChange(0);
        break;
      case "f":
      case "F":
        toggleFullScreen();
        break;
      case "w":
      case "W":
        toggleFullScreen();
        break;
      case "n":
      case "N":
        nextMedia();
        break;
      case "p":
      case "P":
        previousMedia();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const hideControlsTimeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      clearTimeout(hideControlsTimeout);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [showControls]);

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
      className={`player border border-gray-300 rounded-md overflow-hidden relative ${
        isFullScreen ? "fixed top-0 left-0 right-0 bottom-0" : ""
      }`}
      onMouseEnter={toggleControls}
      onMouseLeave={toggleControls}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="animate-spin">
            <Loader />
          </div>
        </div>
      )}
      <video
        ref={mediaRef}
        src={mediaList[currentMediaIndex]}
        className="w-full"
      >
        Your browser does not support the video tag.
      </video>
      {showControls && (
        <div className="controls p-4 bg-gray-200 flex items-center justify-between absolute bottom-0 left-0 right-0">
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
            onClick={toggleFullScreen}
          >
            <Maximize2 />
          </button>
          <div className="text-white">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      )}
      <div
        ref={progressRef}
        className="progress-bar bg-gray-300 h-2 cursor-pointer absolute bottom-0 left-0 right-0"
        onClick={handleProgressClick}
      >
        <div
          className="progress bg-blue-500 h-full"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default MediaPlayer;
