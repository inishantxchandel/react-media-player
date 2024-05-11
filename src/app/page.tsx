import MediaPlayer from "./components/mediaPlayer";
import { mediaList } from "@/lib/constants";

export default function Home() {

  return (
   <>
    <div className="">
      <h1 className="text-3xl py-4 font-bold text-gray-700 text-center">Media Player</h1>
      <MediaPlayer mediaList={mediaList} />
    </div>
   </>
  );
}
