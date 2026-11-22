// EDIT THIS PLAYLIST: update each title, artist, file path and cover here.
const playlist = [
  { title: 'Membasuh (feat. Rara Sekar)', artist: 'HINDIA', src: './audio/track-01.mp3', cover: './images/Membasuh.jpg' },
  { title: 'Pesisir', artist: 'HINDIA', src: './audio/track-02.mp3', cover: './images/pesisir.jpg' },
  { title: 'Terbuang Dalam Waktu', artist: 'BARASUARA', src: './audio/track-03.mp3', cover: './images/TDL.jpg' },
  { title: 'Am I Bothering You?', artist: 'Reality Club', src: './audio/track-04.mp3', cover: './images/bothering.jpg' },
  { title: 'Katakan Saja', artist: 'Adikara', src: './audio/track-05.mp3', cover: './images/saja.jpg' },
  { title: 'Kota Ini Tak Sama Tanpamu', artist: 'Nadhif Basalamah', src: './audio/track-06.mp3', cover: './images/kota.jpg' },
  { title: 'Lalu Biru', artist: 'Eleanor Whisper', src: './audio/track-07.mp3', cover: './images/LaluBiru.jpg' },
  { title: 'Langit Runtuh', artist: '.Feast', src: './audio/track-08.mp3', cover: './images/langit&tuan.jpg' },
  { title: 'O, Tuan', artist: '.Feast', src: './audio/track-09.mp3', cover: './images/langit&tuan.jpg' },
  { title: 'Untuk Perempuan Yang Sedang Di Pelukan', artist: 'Payung Teduh', src: './audio/track-10.mp3', cover: './images/pelukan.jpg' }
];

const audio = document.querySelector('#portfolio-audio');
const player = document.querySelector('.music-player');
const nav = document.querySelector('.primary-nav');
const menuButton = document.querySelector('.menu-toggle');
const playButton = document.querySelector('[data-play]');
const progress = document.querySelector('[data-progress]');
const volume = document.querySelector('[data-volume]');
const timeLabel = document.querySelector('[data-time]');
const playlistToggle = document.querySelector('[data-playlist-toggle]');
const playlistPanel = document.querySelector('#playlist-panel');
const playlistList = document.querySelector('[data-playlist-list]');
let trackIndex = 0;
const autoplayTrackIndex = 0; // Membasuh is the first item in the playlist.

function formatTime(value) {
  const seconds = Math.floor(value || 0);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function loadTrack(index) {
  trackIndex = (index + playlist.length) % playlist.length;
  const track = playlist[trackIndex];
  audio.src = track.src;
  player.querySelector('[data-track-title]').textContent = track.title;
  player.querySelector('[data-track-artist]').textContent = track.artist;
  player.querySelector('.album-art').src = track.cover;
  progress.value = '0';
  timeLabel.textContent = '0:00';
  renderPlaylist();
}

function renderPlaylist() {
  playlistList.replaceChildren();
  playlist.forEach((track, index) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'playlist-item';
    item.dataset.index = String(index);
    item.setAttribute('aria-current', index === trackIndex ? 'true' : 'false');
    const number = String(index + 1).padStart(2, '0');
    item.innerHTML = `<span>${number}</span><strong></strong><small></small>`;
    item.querySelector('strong').textContent = track.title;
    item.querySelector('small').textContent = track.artist;
    item.addEventListener('click', () => {
      loadTrack(index);
      playlistPanel.hidden = true;
      playlistToggle.setAttribute('aria-expanded', 'false');
      audio.play().catch(() => {});
    });
    playlistList.append(item);
  });
}

// Play is always visitor-triggered; one audio element prevents duplicate playback.
playButton.addEventListener('click', async () => {
  if (audio.paused) {
    try { await audio.play(); }
    catch { player.querySelector('[data-track-title]').textContent = 'File audio belum ditemukan'; }
  } else audio.pause();
});
player.querySelector('[data-next]').addEventListener('click', () => { loadTrack(trackIndex + 1); audio.play().catch(() => {}); });
player.querySelector('[data-prev]').addEventListener('click', () => { loadTrack(trackIndex - 1); audio.play().catch(() => {}); });
audio.addEventListener('play', () => { playButton.textContent = 'Ⅱ'; playButton.setAttribute('aria-label', 'Jeda musik'); player.classList.add('is-playing'); });
audio.addEventListener('pause', () => { playButton.textContent = '▶'; playButton.setAttribute('aria-label', 'Putar musik'); player.classList.remove('is-playing'); });
audio.addEventListener('ended', () => { loadTrack(trackIndex + 1); audio.play().catch(() => {}); });
audio.addEventListener('timeupdate', () => {
  if (audio.duration) progress.value = String(audio.currentTime / audio.duration * 100);
  timeLabel.textContent = formatTime(audio.currentTime);
});
progress.addEventListener('input', () => { if (audio.duration) audio.currentTime = audio.duration * Number(progress.value) / 100; });

function setVolume(value) {
  audio.volume = Math.max(0, Math.min(1, value));
  audio.muted = audio.volume === 0;
  volume.value = String(audio.volume);
  const muteButton = player.querySelector('[data-mute]');
  muteButton.textContent = audio.muted ? 'MUTED' : 'VOL';
  muteButton.setAttribute('aria-label', audio.muted ? 'Aktifkan suara' : 'Matikan suara');
}
audio.volume = Number(volume.value);
volume.addEventListener('input', () => setVolume(Number(volume.value)));
player.querySelector('[data-volume-down]').addEventListener('click', () => setVolume(audio.volume - 0.1));
player.querySelector('[data-volume-up]').addEventListener('click', () => setVolume(audio.volume + 0.1));
player.querySelector('[data-mute]').addEventListener('click', () => setVolume(audio.muted || audio.volume === 0 ? Number(volume.value) || 0.7 : 0));
playlistToggle.addEventListener('click', () => {
  const opened = playlistToggle.getAttribute('aria-expanded') === 'true';
  playlistToggle.setAttribute('aria-expanded', String(!opened));
  playlistPanel.hidden = opened;
});
loadTrack(autoplayTrackIndex);
// Browsers may require a visitor interaction before audible autoplay is allowed.
audio.autoplay = true;
audio.play().catch(() => {
  player.dataset.autoplay = 'blocked';
  playButton.setAttribute('aria-label', 'Putar Membasuh');
});

menuButton.addEventListener('click', () => {
  const opened = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(opened));
  menuButton.setAttribute('aria-label', opened ? 'Tutup navigasi' : 'Buka navigasi');
  nav.classList.toggle('is-open', opened);
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
}));
const sectionObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (!entry.isIntersecting) return;
  nav.querySelectorAll('a').forEach((link) => {
    if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}), { rootMargin: '-35% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));
