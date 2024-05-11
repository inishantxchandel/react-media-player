"use client";
import React, { useState, useEffect, useRef } from "react";
import Controls from "../controls";
import { Expand, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMiniPlayer, setIsMiniPlayer] = useState<boolean>(false);
  const mediaRef = useRef<HTMLMediaElement>(null);
  const mediaFocusRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [initialRender, setInitialRender] = useState<boolean>(true)

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

  useEffect(() => {
    if (mediaRef.current) {
      const media = mediaRef.current;
      if (media.autoplay && !media.paused) {
        setIsPlaying(true);
      }
      if (!isPlaying && media.autoplay) {
        media.play();
      }
      const handleEnded = () => {
        if (!media.loop && currentMediaIndex < mediaList.length - 1) {
          nextMedia();
        }
      };
      media.addEventListener("ended", handleEnded);
      return () => {
        media.removeEventListener("ended", handleEnded);
      };
    }
  }, [currentMediaIndex]);

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

  const toggleMiniPlayer = () => {
    setIsMiniPlayer(!isMiniPlayer);
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (mediaRef.current) {
        mediaRef.current.requestFullscreen();
      }
    } else {
      document.exitFullscreen();
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

  const handleKeyPress = (e: any) => {
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
        toggleMiniPlayer();
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
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    togglePlay,
    handleVolumeChange,
    volume,
    skipTime,
    toggleFullScreen,
    toggleMiniPlayer,
    nextMedia,
    previousMedia,
  ]);

  useEffect(() => {
    setTimeout(() => {
      setInitialRender(false);
    }, 3000);

    return () => {
      setInitialRender(true);
    }
  }
  , [currentMediaIndex])

  return (
    <div
    ref={mediaFocusRef}
    className={cn(
      "player border border-gray-300 rounded-md overflow-hidden group",
      isMiniPlayer ? "w-[300px] h-[169px] fixed bottom-0 right-0" : "w-full md:w-[60%] mx-auto relative",
      isFullScreen ? "top-0 left-0 right-0 bottom-0" : ""
    )}
    
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="animate-spin">
            <Loader />
          </div>
        </div>
      )}
      {mediaList[currentMediaIndex].endsWith(".mp4") ? (
        <div>
          <video
            ref={mediaRef as React.MutableRefObject<HTMLVideoElement>}
            src={mediaList[currentMediaIndex]}
            className="w-full"
            autoPlay
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          ></video>
          {isMiniPlayer && (
            <Expand
              className="absolute top-0 right-0 m-4 cursor-pointer text-slate-900"
              onClick={toggleMiniPlayer}
            />
          )}
        </div>
      ) : (
        <audio
          ref={mediaRef as React.MutableRefObject<HTMLAudioElement>}
          src={mediaList[currentMediaIndex]}
          className="w-full"
          autoPlay
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        ></audio>
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

      <Controls
        className={cn(
          initialRender || mediaList[currentMediaIndex].endsWith(".mp3")  ? "flex" : "sm:group-hover:flex sm:hidden"
        )}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        skipTime={skipTime}
        previousMedia={previousMedia}
        nextMedia={nextMedia}
        handleRateChange={handleRateChange}
        toggleFullScreen={toggleFullScreen}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        handleVolumeChange={handleVolumeChange}
        playbackRate={playbackRate}
        toggleMiniPlayer={toggleMiniPlayer}
      />
    </div>
  );
};

export default MediaPlayer;
