import MediaPlayer from "./components/mediaPlayer";
import { mediaList } from "@/lib/constants";

export default function Home() {

  return (
   <>
      <MediaPlayer mediaList={mediaList} />
   </>
  );
}
