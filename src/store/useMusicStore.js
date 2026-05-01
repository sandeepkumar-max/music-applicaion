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
      
      // Toggle Like
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
