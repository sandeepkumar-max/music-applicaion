// Free Music — No API key needed. Sources: SoundHelix (demo), Public Domain

export const FREE_CATEGORIES = [
  {
    id: 'gaming-bgm',
    label: '🎮 Gaming BGM',
    color: '#7c3aed',
    songs: [
      { id: 'g1', title: 'Epic Battle Theme', artist: 'Free BGM', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
      { id: 'g2', title: 'Boss Fight',        artist: 'Free BGM', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
      { id: 'g3', title: 'Victory Rush',      artist: 'Free BGM', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
      { id: 'g4', title: 'Dark Zone',         artist: 'Free BGM', img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' },
      { id: 'g5', title: 'Neon Streets',      artist: 'Free BGM', img: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3' },
    ],
  },
  {
    id: 'sleep',
    label: '😴 Sleep Music',
    color: '#1d4ed8',
    songs: [
      { id: 's1', title: 'Deep Sleep Flow',   artist: 'Calm Waves', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      { id: 's2', title: 'Night Drift',       artist: 'Calm Waves', img: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
      { id: 's3', title: 'Moonlight Ease',    artist: 'Calm Waves', img: 'https://images.unsplash.com/photo-1468276311594-df7cb65d8df6?q=80&w=300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
      { id: 's4', title: 'Soft Rain Bed',     artist: 'Calm Waves', img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
      { id: 's5', title: 'Stars Lullaby',     artist: 'Calm Waves', img: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3' },
    ],
  },
  {
    id: 'lofi',
    label: '☕ Lofi Study',
    color: '#0891b2',
    songs: [
      { id: 'l1', title: 'Chill Study Beat',  artist: 'Lofi Lab', img: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
      { id: 'l2', title: 'Coffee & Code',     artist: 'Lofi Lab', img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
      { id: 'l3', title: 'Rainy Afternoon',   artist: 'Lofi Lab', img: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
      { id: 'l4', title: 'Pixel Dreams',      artist: 'Lofi Lab', img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' },
      { id: 'l5', title: 'Late Night Vibes',  artist: 'Lofi Lab', img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3' },
    ],
  },
  {
    id: 'ambient',
    label: '🧘 Meditation',
    color: '#059669',
    songs: [
      { id: 'm1', title: 'Zen Garden',        artist: 'Mindful Sounds', img: 'https://images.unsplash.com/photo-1536623975707-c4b3b2af565d?q=80&w=300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3' },
      { id: 'm2', title: 'Inner Peace',       artist: 'Mindful Sounds', img: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3' },
      { id: 'm3', title: 'Morning Breath',    artist: 'Mindful Sounds', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      { id: 'm4', title: 'Forest Healing',    artist: 'Mindful Sounds', img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    ],
  },
  {
    id: 'nature',
    label: '🌧️ Nature Sounds',
    color: '#065f46',
    songs: [
      { id: 'n1', title: 'Heavy Rain',        artist: 'Nature Studio', img: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?q=80&w=300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
      { id: 'n2', title: 'Ocean Waves',       artist: 'Nature Studio', img: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
      { id: 'n3', title: 'Jungle Birds',      artist: 'Nature Studio', img: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
      { id: 'n4', title: 'Thunderstorm',      artist: 'Nature Studio', img: 'https://images.unsplash.com/photo-1504608524841-42584120d693?q=80&w=300', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' },
    ],
  },
];
