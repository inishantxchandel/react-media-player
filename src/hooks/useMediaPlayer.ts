import { useState, useEffect, useRef } from "react";

const useMediaPlayer = (initialMediaIndex: number, mediaList: string[]) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(initialMediaIndex);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(100);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMiniPlayer, setIsMiniPlayer] = useState<boolean>(false);
  const mediaRef = useRef<HTMLMediaElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);



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

  const isVideo = (url: string): boolean => {
    const videoExtensions = [".mp4", ".avi", ".mov", ".wmv", ".mkv"]; // Add more extensions as needed
    const fileExtension = url.substring(url.lastIndexOf("."));
  
    return videoExtensions.includes(fileExtension);
  };

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

  return {
    currentMediaIndex,
    isPlaying,
    volume,
    playbackRate,
    duration,
    currentTime,
    isFullScreen,
    isLoading,
    isMiniPlayer,
    mediaRef,
    progressRef,
    togglePlay,
    handleVolumeChange,
    handleRateChange,
    skipTime,
    nextMedia,
    previousMedia,
    toggleMiniPlayer,
    toggleFullScreen,
    handleProgressClick,
    isVideo,
    setIsPlaying
  };
};

export default useMediaPlayer;
