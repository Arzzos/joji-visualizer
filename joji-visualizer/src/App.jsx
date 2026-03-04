import { useState } from 'react';
import SongList from './components/SongList';
import Visualizer from './components/Visualizer';
import songsData from './data/songs.json';

export default function App() {
  const [currentSong, setCurrentSong] = useState(null);

  return (
    <main>
      {!currentSong ? (
        <SongList songs={songsData} onSelect={setCurrentSong} />
      ) : (
        <Visualizer song={currentSong} onBack={() => setCurrentSong(null)} />
      )}
    </main>
  );
}