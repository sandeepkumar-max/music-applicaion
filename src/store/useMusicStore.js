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
      localSongs: [],       // phone ke scanned songs
      scanDone: false,      // kya scan pehle ho chuka hai
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
      isPlaying: false,
      userName: 'Gamer',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
      eqValues: { bass: 50, mid: 50, treble: 50 }, // Equalizer — persists
      
      togglePlayer: () => set({ isPlayerOpen: !get().isPlayerOpen }),
      setPlayerOpen: (isOpen) => set({ isPlayerOpen: isOpen }),
      setCurrentSong: (song) => set({ currentSong: song }),
      setIsPlaying: (val) => set({ isPlaying: val }),
      setLocalSongs: (songs) => set({ localSongs: songs }),
      setScanDone: (val) => set({ scanDone: val }),
      clearCurrentSong: () => set({ currentSong: null, isPlaying: false, isPlayerOpen: false }),
      setUserName: (name) => set({ userName: name }),
      setUserAvatar: (url) => set({ userAvatar: url }),
      setEqValues: (vals) => set({ eqValues: vals }),
      
      playNext: () => {
        const { currentSong, localSongs, history, setCurrentSong } = get();
        if (!currentSong) return;
        const queue = localSongs.length > 0 ? localSongs : history;
        if (queue.length === 0) return;
        const currentIdx = queue.findIndex(s => s.id === currentSong.id);
        const nextIdx = currentIdx === -1 || currentIdx === queue.length - 1 ? 0 : currentIdx + 1;
        setCurrentSong(queue[nextIdx]);
      },

      playPrev: () => {
        const { currentSong, localSongs, history, setCurrentSong } = get();
        if (!currentSong) return;
        const queue = localSongs.length > 0 ? localSongs : history;
        if (queue.length === 0) return;
        const currentIdx = queue.findIndex(s => s.id === currentSong.id);
        const prevIdx = currentIdx <= 0 ? queue.length - 1 : currentIdx - 1;
        setCurrentSong(queue[prevIdx]);
      },

      toggleLike: (song) => {
        const likedSongs = get().likedSongs || [];
        const exists = likedSongs.find(s => s.id === song.id);
        if (exists) {
          set({ likedSongs: likedSongs.filter(s => s.id !== song.id) });
        } else {
          set({ likedSongs: [...likedSongs, song] });
        }
      },
      
      // Is Liked
      isLiked: (songId) => {
        const likedSongs = get().likedSongs || [];
        return likedSongs.some(s => s.id === songId);
      },

      // Playlist Actions
      createPlaylist: (name) => {
        const playlists = get().playlists || [];
        const newPlaylist = { id: Date.now().toString(), name, songs: [] };
        set({ playlists: [...playlists, newPlaylist] });
      },
      
      deletePlaylist: (playlistId) => {
        const playlists = get().playlists || [];
        set({ playlists: playlists.filter(p => p.id !== playlistId) });
      },

      addToPlaylist: (playlistId, song) => {
        set((state) => ({
          playlists: (state.playlists || []).map(p => {
            if (p.id === playlistId) {
              // Prevent duplicates
              if (!(p.songs || []).find(s => s.id === song.id)) {
                return { ...p, songs: [...(p.songs || []), song] };
              }
            }
            return p;
          })
        }));
      },

      removeFromPlaylist: (playlistId, songId) => {
        set((state) => ({
          playlists: (state.playlists || []).map(p => {
            if (p.id === playlistId) {
              return { ...p, songs: (p.songs || []).filter(s => s.id !== songId) };
            }
            return p;
          })
        }));
      },

      addToHistory: (song) => {
        const history = get().history || [];
        const filteredHistory = history.filter(s => s.id !== song.id);
        const newHistory = [song, ...filteredHistory].slice(0, 20); // keep last 20
        set({ history: newHistory });
      }
    }),
    {
      name: 'tunefy-music-storage',
      // Only persist these fields — exclude large/non-serializable data
      partialize: (state) => ({
        likedSongs:  state.likedSongs,
        playlists:   state.playlists,
        history:     state.history,
        userName:    state.userName,
        userAvatar:  state.userAvatar,
        scanDone:    state.scanDone,
        eqValues:    state.eqValues, // EQ settings persist
        // localSongs: excluded — re-scanned on open (blobs/File refs aren't serializable)
        // currentSong: excluded — re-set when user plays
      }),
    }
  )
);
