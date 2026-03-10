// dropdown.js (or inside a <script> tag)
document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.querySelector('.dropdown');
  const btn = dropdown.querySelector('.dropdown-btn');
  const menu = dropdown.querySelector('.dropdown-content');

  const songList = document.querySelector('.songList');
  const songs = Array.from(songList.querySelectorAll('li'));
  const subtitle = document.querySelector('.Subheading1');

  const filterSongs = (genre) => {
    songs.forEach((song) => {
      const songGenre = song.dataset.genre || 'all';
      song.style.display = genre === 'all' || songGenre === genre ? '' : 'none';
    });

    subtitle.textContent = genre === 'all' ? 'All Songs' : `${genre.charAt(0).toUpperCase()}${genre.slice(1)} Songs`;
    renderPlaylists();
  };

  btn.addEventListener('click', () => {
    menu.classList.toggle('show');
  });

  // Update button text and filter list when an item is selected
  menu.querySelectorAll('a').forEach((item) => {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      const genre = item.getAttribute('href').slice(1);
      btn.textContent = item.textContent;
      filterSongs(genre);
      menu.classList.remove('show');
    });
  });

  const centre = document.querySelector('.centre');
  const rightPane = document.querySelector('.right');

  let currentSongElement = null;
  const playlists = {
    Rock: [],
    Pop: [],
    Country: [],
    'Hip-Hop': [],
  };
  let currentPlaylist = 'Rock';

  const renderPlaylists = () => {
    const currentList = playlists[currentPlaylist] || [];

    const currentItems = currentList
      .map(
        (item) =>
          `<li class="playlist-item"><strong>${item.title}</strong><br><span>${item.artist}</span></li>`
      )
      .join('');

    const currentListHtml =
      currentItems ||
      '<p class="playlist-empty">You\'ve not added any songs yet!</p>';

    const allPlaylists = Object.keys(playlists)
      .map((name) => {
        const active = name === currentPlaylist ? ' playlist-active' : '';
        return `<button class="playlist-switch${active}" data-playlist="${name}">${name}</button>`;
      })
      .join('');

    rightPane.innerHTML = `
      <section class="playlist-section">
        <h3 class="playlist-title">Current Playlist: ${currentPlaylist}</h3>
        ${currentListHtml}
      </section>
      <section class="playlist-section">
        <h3 class="playlist-title">All Playlists</h3>
        <button class="btn btn-clear" type="button">Clear current playlist</button>
        <div class="playlist-switcher">${allPlaylists}</div>
      </section>
    `;

    const clearBtn = rightPane.querySelector('.btn-clear');
    clearBtn.addEventListener('click', () => {
      const currentList = playlists[currentPlaylist] || [];
      if (currentList.length === 0) {
        window.alert('No songs in the playlist!');
        return;
      }
      playlists[currentPlaylist] = [];
      renderPlaylists();
    });

    rightPane.querySelectorAll('.playlist-switch').forEach((btn) => {
      btn.addEventListener('click', () => {
        currentPlaylist = btn.dataset.playlist;
        renderPlaylists();
      });
    });
  };

  const getVisibleSongs = () => songs.filter((song) => song.style.display !== 'none');

  const setCurrentSong = (song) => {
    currentSongElement = song;
  };

  const playSong = ({ image, title, artist, audio, lyrics }) => {
    const lyricsLink = lyrics
      ? `<p class="player-lyrics"><a href="${lyrics}" target="_blank" rel="noopener">View lyrics</a></p>`
      : '';

    centre.innerHTML = `
      <div class="player">
        <img class="player-image" src="${image}" alt="${title}">
        <div class="player-meta">
          <h3>${title}</h3>
          <p class="player-artist">${artist}</p>
          ${lyricsLink}
        </div>

        <audio class="player-audio" controls src="${audio}" autoplay></audio>

        <div class="player-controls">
          <div class="player-actions">
            <button class="btn btn-add">Add to playlist</button>
          </div>
          <div class="player-actions spaced">
            <button class="btn btn-prev">← Prev</button>
            <button class="btn btn-next">Next →</button>
          </div>
        </div>
      </div>
    `;

    const addBtn = centre.querySelector('.btn-add');
    const prevBtn = centre.querySelector('.btn-prev');
    const nextBtn = centre.querySelector('.btn-next');

    addBtn.addEventListener('click', () => {
      if (!currentSongElement) return;

      const songGenre = (currentSongElement.dataset.genre || '').toLowerCase();
      const normalizedPlaylist = currentPlaylist.toLowerCase();
      const isMismatch = songGenre && normalizedPlaylist !== songGenre;

      if (isMismatch) {
        const proceed = window.confirm(
          'This song does not belong in this playlist, do you still wish to continue?'
        );
        if (!proceed) return;
      }

      const songData = {
        title: currentSongElement.dataset.title || currentSongElement.textContent.trim(),
        artist: currentSongElement.dataset.artist || '',
      };
      const current = playlists[currentPlaylist];
      current.push(songData);
      renderPlaylists();
    });

    const playIndex = (step) => {
      const visible = getVisibleSongs();
      if (!visible.length) return;

      const currentIndex = visible.indexOf(currentSongElement);
      const nextIndex = (currentIndex + step + visible.length) % visible.length;
      const nextSong = visible[nextIndex];
      if (!nextSong) return;

      const songData = {
        image: nextSong.dataset.image,
        title: nextSong.dataset.title || nextSong.textContent.trim(),
        artist: nextSong.dataset.artist || '',
        audio: nextSong.dataset.audio,
        lyrics: nextSong.dataset.lyrics,
      };
      setCurrentSong(nextSong);
      playSong(songData);
    };

    prevBtn.addEventListener('click', () => playIndex(-1));
    nextBtn.addEventListener('click', () => playIndex(1));
  };

  // Render playlist panel and play the first visible song by default
  const init = () => {
    renderPlaylists();

    const visible = getVisibleSongs();
    if (!visible.length) return;

    const first = visible[0];
    setCurrentSong(first);
    const songData = {
      image: first.dataset.image,
      title: first.dataset.title || first.textContent.trim(),
      artist: first.dataset.artist || '',
      audio: first.dataset.audio,
      lyrics: first.dataset.lyrics,
    };
    if (songData.audio) playSong(songData);
  };

  init();

  songs.forEach((song) => {
    song.addEventListener('click', () => {
      setCurrentSong(song);
      const songData = {
        image: song.dataset.image,
        title: song.dataset.title || song.textContent.trim(),
        artist: song.dataset.artist || '',
        audio: song.dataset.audio,
        lyrics: song.dataset.lyrics,
      };
      if (songData.audio) playSong(songData);
    });
  });

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const themeText = document.querySelector('.toggle-text');

  const setTheme = (isDark) => {
    document.body.classList.toggle('dark', isDark);
    themeText.textContent = isDark ? 'Light' : 'Dark';
    themeToggle.checked = isDark;
  };

  themeToggle.addEventListener('change', () => {
    setTheme(themeToggle.checked);
  });

  // Initialize theme state
  setTheme(false);


  // Optional: close when clicking outside
  document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target)) {
      menu.classList.remove('show');
    }
  });
});