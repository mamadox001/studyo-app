// 100% Free Music & Radio Engine for Deep Focus Work
// Supports Free 24/7 Internet Radio Streams & YouTube Ambient Study Streams
// Zero subscriptions, zero paid APIs, completely free.

export const FOCUS_STATIONS = [
  {
    id: 'lofi-beats',
    name: 'Lofi Study Beats',
    subtitle: '24/7 Chillhop & Downtempo Beats',
    genre: 'Lo-Fi / Chillhop',
    type: 'stream',
    icon: '☕',
    url: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    backupUrl: 'https://streams.ilovemusic.de/iloveradio17.mp3'
  },
  {
    id: 'nightwave-ambient',
    name: 'Nightwave Ambient',
    subtitle: 'Dreamy Cyberpunk & Vaporwave Chill',
    genre: 'Vapor / Ambient',
    icon: '🌌',
    type: 'stream',
    url: 'https://radio.plaza.one/mp3',
    backupUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv'
  },
  {
    id: 'classical-piano',
    name: 'Classical & Solo Piano',
    subtitle: '100% Royalty-Free Public Domain Piano',
    genre: 'Classical Piano',
    icon: '🎹',
    type: 'stream',
    url: 'https://live.musopen.org:8085/streamvbr0',
    backupUrl: 'https://radio.plaza.one/mp3'
  },
  {
    id: 'lofi-girl-yt',
    name: 'Lofi Girl 24/7',
    subtitle: 'Beats to relax/study to (Live Stream)',
    genre: 'YouTube Live',
    icon: '🎧',
    type: 'youtube',
    ytId: 'jfKfPfyJRdk'
  },
  {
    id: 'synthwave-yt',
    name: 'Synthwave Radio 24/7',
    subtitle: 'Chill Synth Beats for Code & Flow',
    genre: 'YouTube Live',
    icon: '⚡',
    type: 'youtube',
    ytId: '4xDzrJKXOOY'
  },
  {
    id: 'coffee-shop-yt',
    name: 'Rainy Café Jazz',
    subtitle: 'Warm jazz & espresso background ambience',
    genre: 'YouTube Live',
    icon: '🌧️',
    type: 'youtube',
    ytId: '2kg_2gZ99kY'
  }
];

class MusicEngine {
  constructor() {
    this.audio = null;
    this.currentStation = FOCUS_STATIONS[0];
    this.isPlaying = false;
    this.volume = 0.65;
    this.listeners = new Set();
  }

  initAudio() {
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.crossOrigin = 'anonymous';
      this.audio.preload = 'none';

      this.audio.addEventListener('playing', () => {
        this.isPlaying = true;
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });

      this.audio.addEventListener('error', (e) => {
        console.warn('Audio stream error, trying backup...', e);
        if (this.currentStation.backupUrl && this.audio.src !== this.currentStation.backupUrl) {
          this.audio.src = this.currentStation.backupUrl;
          this.audio.play().catch(err => console.log('Backup error', err));
        } else {
          this.isPlaying = false;
          this.notify();
        }
      });
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach(cb => cb(state));
  }

  getState() {
    return {
      currentStation: this.currentStation,
      isPlaying: this.isPlaying,
      volume: this.volume,
    };
  }

  setStation(station) {
    this.currentStation = station;
    if (station.type === 'stream') {
      this.initAudio();
      this.audio.src = station.url;
      this.audio.volume = this.volume;
      this.audio.play().then(() => {
        this.isPlaying = true;
        this.notify();
      }).catch(err => {
        console.warn('Playback error', err);
        this.isPlaying = false;
        this.notify();
      });
    } else {
      // YouTube station
      if (this.audio) {
        this.audio.pause();
      }
      this.isPlaying = true;
      this.notify();
    }
  }

  togglePlay() {
    if (this.currentStation.type === 'stream') {
      this.initAudio();
      if (this.isPlaying) {
        this.audio.pause();
        this.isPlaying = false;
      } else {
        if (!this.audio.src) {
          this.audio.src = this.currentStation.url;
        }
        this.audio.volume = this.volume;
        this.audio.play().then(() => {
          this.isPlaying = true;
          this.notify();
        }).catch(err => {
          console.warn('Playback error', err);
          this.isPlaying = false;
          this.notify();
        });
      }
    } else {
      // Toggle YouTube playback
      this.isPlaying = !this.isPlaying;
    }
    this.notify();
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
    this.notify();
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
    }
    this.isPlaying = false;
    this.notify();
  }
}

export const musicEngine = new MusicEngine();
