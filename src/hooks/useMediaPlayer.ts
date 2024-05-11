import { useState, useEffect, useRef } from "react";

const useMediaPlayer = (initialMediaIndex: number, mediaList: string[]) => {
  const [currentMediaIndex, setCurrentMediaIndex] =
    useState<number>(initialMediaIndex); // Index of the currently playing media
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // Playback state
  const [volume, setVolume] = useState<number>(100); // Volume level
  const [playbackRate, setPlaybackRate] = useState<number>(1.0); // Playback speed
  const [duration, setDuration] = useState<number>(0); // Total duration of the media
  const [currentTime, setCurrentTime] = useState<number>(0); // Current playback time
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false); // Fullscreen mode
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [isMiniPlayer, setIsMiniPlayer] = useState<boolean>(false); // Mini player mode

  // Refs for media and progress bar
  const mediaRef = useRef<HTMLMediaElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Function to update current time during playback
  const updateTime = () => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime);
    }
  };

  // Handler for volume change
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  // Handler for playback rate change
  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
  };

  // Function to skip time during playback
  const skipTime = (time: number) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime += time;
    }
  };

  // Function to play the next media in the list
  const nextMedia = () => {
    if (currentMediaIndex < mediaList.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    }
  };

  // Function to play the previous media in the list
  const previousMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    }
  };

  // Function to toggle mini player mode
  const toggleMiniPlayer = () => {
    setIsMiniPlayer(!isMiniPlayer);
  };

  // Function to toggle fullscreen mode
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

  // Handler for media loading
  const handleLoading = () => {
    setIsLoading(true);
  };

  // Handler for media loaded
  const handleLoaded = () => {
    setIsLoading(false);
  };

  // Function to toggle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      mediaRef.current?.pause();
    } else {
      mediaRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handler for progress bar click
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

  // Handler for keyboard shortcuts
  const handleKeyPress = (e: any) => {
    console.log(e.key);
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
      case "Escape":
        if (isFullScreen) {
          toggleFullScreen();
        }
        break;
      default:
        break;
    }
  };

  // Function to check if media is a video file
  const isVideo = (url: string): boolean => {
    const videoExtensions = [".mp4", ".avi", ".mov", ".wmv", ".mkv"]; // Supported video extensions
    const fileExtension = url.substring(url.lastIndexOf("."));

    return videoExtensions.includes(fileExtension);
  };

  // Effect to set up media listeners and cleanup
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

  // Effect to handle autoplay and media end
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

  // Effect to add keyboard event listener
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

  // Return all the necessary functions and states
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
    setIsPlaying,
  };
};

export default useMediaPlayer;
