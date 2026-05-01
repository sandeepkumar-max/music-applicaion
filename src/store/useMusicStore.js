import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMusicStore = create(
  persist(
    (set, get) => ({
      likedSongs: [],
      playlists: [
        { id: '1', name: 'Chill Vibes', songs: [] },
        { id: '2', name: 'Workout', songs: [] }
      ],
      history: [],
      currentSong: {
        id: "song-1",
        title: "Neon Nights",
        artist: "Synthwave Journey",
        album: "Midnight Drive",
        artwork: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=500&auto=format&fit=crop",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      },
      isPlayerOpen: false,
      
      togglePlayer: () => set({ isPlayerOpen: !get().isPlayerOpen }),
      setPlayerOpen: (isOpen) => set({ isPlayerOpen: isOpen }),
      setCurrentSong: (song) => set({ currentSong: song }),
      toggleLike: (song) => {
        const { likedSongs } = get();
        const exists = likedSongs.find(s => s.id === song.id);
        if (exists) {
          set({ likedSongs: likedSongs.filter(s => s.id !== song.id) });
        } else {
          set({ likedSongs: [...likedSongs, song] });
        }
      },
      
      // Is Liked
      isLiked: (songId) => {
        return get().likedSongs.some(s => s.id === songId);
      },

      // Playlist Actions
      createPlaylist: (name) => {
        const newPlaylist = { id: Date.now().toString(), name, songs: [] };
        set({ playlists: [...get().playlists, newPlaylist] });
      },
      
      deletePlaylist: (playlistId) => {
        set({ playlists: get().playlists.filter(p => p.id !== playlistId) });
      },

      addToPlaylist: (playlistId, song) => {
        set((state) => ({
          playlists: state.playlists.map(p => {
            if (p.id === playlistId) {
              // Prevent duplicates
              if (!p.songs.find(s => s.id === song.id)) {
                return { ...p, songs: [...p.songs, song] };
              }
            }
            return p;
          })
        }));
      },

      removeFromPlaylist: (playlistId, songId) => {
        set((state) => ({
          playlists: state.playlists.map(p => {
            if (p.id === playlistId) {
              return { ...p, songs: p.songs.filter(s => s.id !== songId) };
            }
            return p;
          })
        }));
      },

      // History Actions (Max 20 items)
      addToHistory: (song) => {
        const { history } = get();
        const filteredHistory = history.filter(s => s.id !== song.id);
        const newHistory = [song, ...filteredHistory].slice(0, 20); // keep last 20
        set({ history: newHistory });
      }
    }),
    {
      name: 'tunefy-music-storage', // key in local storage
    }
  )
);
