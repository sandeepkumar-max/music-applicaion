import { Capacitor } from '@capacitor/core';

/**
 * musicScanner.js
 * On Android (native): uses @capacitor/filesystem to read ALL audio files
 * On browser: uses jsmediatags on a File object array (from file picker)
 */

const FALLBACK_ART = 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f4b5?q=80&w=300&auto=format&fit=crop';
const AUDIO_EXTS = ['.mp3', '.m4a', '.flac', '.ogg', '.wav', '.aac', '.opus', '.wma'];

// ─────────────────────────────────────────────
// ANDROID NATIVE SCAN
// Uses @capacitor/filesystem to list music folders
// ─────────────────────────────────────────────
export async function scanNativeMusic(onProgress) {
  const { Filesystem, Directory } = await import('@capacitor/filesystem');

  const songs = [];
  // Common Android music folders
  const scanDirs = ['Music', 'Download', 'Downloads', 'DCIM', 'WhatsApp/Media/WhatsApp Audio', 'Recordings'];

  for (const dir of scanDirs) {
    try {
      await scanDirectory(Filesystem, Directory.ExternalStorage, dir, songs, onProgress);
    } catch {
      // folder may not exist — skip silently
    }
  }

  return songs;
}

async function scanDirectory(Filesystem, baseDir, dirPath, results, onProgress) {
  let contents;
  try {
    const res = await Filesystem.readdir({ path: dirPath, directory: baseDir });
    contents = res.files;
  } catch {
    return;
  }

  for (const entry of contents) {
    const fullPath = dirPath ? `${dirPath}/${entry.name}` : entry.name;
    const nameLower = entry.name.toLowerCase();

    if (entry.type === 'directory') {
      // Recurse one level deep (avoid infinite recursion in huge trees)
      try {
        await scanDirectory(Filesystem, baseDir, fullPath, results, onProgress);
      } catch {
        // skip
      }
    } else if (AUDIO_EXTS.some(ext => nameLower.endsWith(ext))) {
      try {
        // Get a web-accessible URI for playback
        const uriResult = await Filesystem.getUri({ path: fullPath, directory: baseDir });
        const playableUri = Capacitor.convertFileSrc(uriResult.uri);

        const title = entry.name.replace(/\.[^/.]+$/, '');
        results.push({
          id: `native-${uriResult.uri}`,
          title,
          artist: 'Unknown Artist',
          img: FALLBACK_ART,
          src: playableUri,
          nativePath: uriResult.uri,
        });

        onProgress && onProgress(results.length);
      } catch {
        // skip unreadable file
      }
    }
  }
}

// ─────────────────────────────────────────────
// BROWSER SCAN (File picker → jsmediatags)
// ─────────────────────────────────────────────
export async function scanBrowserFiles(files, onProgress) {
  const jsmediatags = (await import('jsmediatags')).default;
  const songs = [];

  await Promise.all(
    Array.from(files)
      .filter(f => f.type.startsWith('audio/') || AUDIO_EXTS.some(ext => f.name.toLowerCase().endsWith(ext)))
      .map(file =>
        new Promise(resolve => {
          jsmediatags.read(file, {
            onSuccess: (tag) => {
              let img = FALLBACK_ART;
              if (tag.tags.picture) {
                try {
                  const { data, format } = tag.tags.picture;
                  img = URL.createObjectURL(new Blob([new Uint8Array(data)], { type: format }));
                } catch { /* ignore */ }
              }
              const src = URL.createObjectURL(file);
              songs.push({
                id: `browser-${file.name}-${file.lastModified}`,
                title: tag.tags.title || file.name.replace(/\.[^/.]+$/, ''),
                artist: tag.tags.artist || 'Unknown Artist',
                img,
                src,
              });
              onProgress && onProgress(songs.length);
              resolve();
            },
            onError: () => {
              songs.push({
                id: `browser-${file.name}-${file.lastModified}`,
                title: file.name.replace(/\.[^/.]+$/, ''),
                artist: 'Unknown Artist',
                img: FALLBACK_ART,
                src: URL.createObjectURL(file),
              });
              onProgress && onProgress(songs.length);
              resolve();
            },
          });
        })
      )
  );

  return songs;
}
