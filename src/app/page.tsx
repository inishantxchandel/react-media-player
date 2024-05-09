import Image from "next/image";
import MediaPlayer from "./components/mediaPlayer";

export default function Home() {
  const mediaList = [
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Sample video
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', // Another sample video,
    'https://archive.org/download/testmp3testfile/mpthreetest.mp3' // Sample audio
  ];
  return (
   <>
    <div className="container mx-auto">
      <h1 className="text-xl font-bold">Media Player</h1>
      <MediaPlayer mediaList={mediaList} />
    </div>
   </>
  );
}
