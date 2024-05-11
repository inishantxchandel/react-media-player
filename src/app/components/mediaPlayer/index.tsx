"use client";
import React, { useState, useEffect, useRef } from "react";
import Controls from "../controls";
import { Expand, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import useMediaPlayer from "@/hooks/useMediaPlayer";

interface MediaPlayerProps {
  mediaList: string[]; // List of media URLs
  initialMediaIndex?: number; // Index of the initial media item (optional, defaults to 0)
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({
  mediaList,
  initialMediaIndex = 0,
}) => {
  // State to track initial render
  const [initialRender, setInitialRender] = useState<boolean>(true);

  // Destructuring values from the custom hook
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
    setIsPlaying,
  } = useMediaPlayer(initialMediaIndex, mediaList);

  return (
    <div>
      <h1 className="text-4xl pt-4 pb-2 font-bold text-gray-700 text-center">{`Media Player(${currentMediaIndex+1}/${mediaList.length})`}</h1>
      <h4 className="text-xl pb-4 font-bold text-gray-700 text-center">Playing: {isVideo(mediaList[currentMediaIndex])?"Video":"Audio"}</h4>
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
      {/* Display loader if media is loading */}
      {isLoading && (
        <div className="absolute inset-0 flex z-50 items-center justify-center bg-black bg-opacity-50">
          <div className="animate-spin">
            <Loader />
          </div>
        </div>
      )}
      {/* Render video or audio element based on media type */}
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

          {/* Render expand icon for mini player */}
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
      {/* Render progress bar */}
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

      {/* Render controls */}
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
        currentMediaIndex={currentMediaIndex}
        mediaList={mediaList}
      />
    </div>
    </div>
  );
};

export default MediaPlayer;
