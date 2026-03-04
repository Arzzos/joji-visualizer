import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const songsPath = path.join(__dirname, '../src/data/songs.json');
const songs = JSON.parse(fs.readFileSync(songsPath, 'utf8'));

// Seleccionamos la canción de Joji
const song = songs[0];

console.clear();
console.log(`\x1b[2m------------------------------------------\x1b[0m`);
console.log(`\x1b[1m\x1b[34m JOJI - ${song.title.toUpperCase()} \x1b[0m`);
console.log(`\x1b[2m Album: ${song.album} \x1b[0m`);
console.log(`\x1b[2m------------------------------------------\x1b[0m\n`);

song.lyrics.forEach((lyric) => {
  setTimeout(() => {
    // Limpiamos la línea anterior y escribimos la nueva con un efecto de color
    process.stdout.write(`\r\x1b[K\x1b[37m${lyric.text}\x1b[0m`);
  }, lyric.time * 1000);
});

// Nota: En la terminal no se puede reproducir audio de YouTube fácilmente, 
// así que esto funciona como un visualizador de letras sincronizado.