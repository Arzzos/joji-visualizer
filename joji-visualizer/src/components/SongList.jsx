import { Play } from "lucide-react";

export default function SongList({ songs, onSelect }) {
  return (
    <div className="max-w-4xl mx-auto pt-20 px-6">
      <header className="mb-12">
        <h1 className="text-5xl font-bold mb-2 tracking-tighter">
          JOJI ARCHIVE
        </h1>
        <p className="text-neutral-500 uppercase tracking-widest text-xs">
          Fan Visualizer Project
        </p>
      </header>

      <div className="grid gap-4">
        {songs.map((song) => (
          <div
            key={song.id}
            onClick={() => onSelect(song)}
            className="group flex items-center justify-between p-6 bg-neutral-900/50 border border-neutral-800 rounded-xl cursor-pointer hover:bg-neutral-800/50 hover:border-neutral-700 transition-all"
          >
            <div>
              <h3 className="text-xl font-medium">{song.title}</h3>
              <p className="text-neutral-500 text-sm">{song.album}</p>
            </div>

            <div className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Play size={20} fill="currentColor" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}