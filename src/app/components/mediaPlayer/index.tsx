"use client";
import React, { useState, useEffect, useRef } from "react";
import Controls from "../controls";
import { Expand, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import useMediaPlayer from "@/hooks/useMediaPlayer";

interface MediaPlayerProps {
  mediaList: string[];
  initialMediaIndex?: number;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({
  mediaList,
  initialMediaIndex = 0,
}) => {

  const [initialRender, setInitialRender] = useState<boolean>(true);

  const {
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
  } = useMediaPlayer(initialMediaIndex, mediaList);

  return (
    <div
      className={cn(
        "player border border-gray-300 rounded-md overflow-hidden group transition-all duration-300",
        isMiniPlayer
          ? "w-[300px] h-[169px] fixed bottom-0 right-0 "
          : "w-full md:w-[60%] mx-auto relative ",
        isFullScreen ? "top-0 left-0 right-0 bottom-0" : ""
      )}
      onMouseEnter={() => setInitialRender(false)}
    >
      {isLoading && (
        <div className="absolute inset-0 flex z-50 items-center justify-center bg-black bg-opacity-50">
          <div className="animate-spin">
            <Loader />
          </div>
        </div>
      )}
      {isVideo(mediaList[currentMediaIndex]) ? (
        <div className="relative">
          <video
            ref={mediaRef as React.MutableRefObject<HTMLVideoElement>}
            src={mediaList[currentMediaIndex]}
            className="w-full"
            autoPlay
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          ></video>

          {isMiniPlayer && (
            <>
              <div className="bg-gradient-to-bl from-black/70 via-transparent to-transparent absolute inset-0"></div>

              <Expand
                className="absolute top-0 right-0 m-4 cursor-pointer text-white  rounded-md p-1"
                onClick={toggleMiniPlayer}
              />
            </>
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
          initialRender || !isVideo(mediaList[currentMediaIndex])
            ? "flex"
            : "sm:group-hover:flex sm:hidden"
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
