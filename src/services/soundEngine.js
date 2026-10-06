// Pure Web Audio API Ambient Sound Synthesizer & Tactile Audio Engine
// 100% Offline, Zero external files, Zero network latency

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.nodes = {
      rain: null,
      brownNoise: null,
      binaural: null,
      crackle: null,
    };
    this.volumes = {
      rain: 0,
      brownNoise: 0,
      binaural: 0,
      crackle: 0,
      master: 0.7,
    };
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Generate white noise buffer
  createNoiseBuffer(duration = 5) {
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // Tactile Mechanical Click Sound for buttons
  playClick() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.25 * this.volumes.master, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      console.warn('Audio not initialized yet', e);
    }
  }

  // Zen Bell / Chime for session complete
  playChime() {
    try {
      this.init();
      const frequencies = [528, 660, 792, 1056]; // Solfeggio & Harmonic frequencies
      frequencies.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.1);

        const startTime = this.ctx.currentTime + idx * 0.1;
        gain.gain.setValueAtTime(0.15 * this.volumes.master, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 2.6);
      });
    } catch (e) {
      console.warn('Chime audio error', e);
    }
  }

  // Celebratory Crystal Fanfare / Quest Completed Sound
  playSuccess() {
    try {
      this.init();
      // Ascending crystalline major chord (C5, E5, G5, C6)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        const start = this.ctx.currentTime + idx * 0.08;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.18 * this.volumes.master, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.42);
      });
    } catch (e) {
      console.warn('Success sound error', e);
    }
  }

  // Tactile Bubble Pop for checkbox check/uncheck
  playPop() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(850, this.ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.2 * this.volumes.master, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.045);
    } catch (e) {
      console.warn('Pop sound error', e);
    }
  }

  // Rain Sound Synthesizer
  setRainVolume(val) {
    this.volumes.rain = val;
    this.updateRain();
  }

  updateRain() {
    if (!this.ctx) return;
    if (this.volumes.rain <= 0 || this.isMuted) {
      if (this.nodes.rain) {
        this.nodes.rain.gain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.1);
      }
      return;
    }

    if (!this.nodes.rain) {
      const buffer = this.createNoiseBuffer(4);
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      // Bandpass filter to sculpt rain frequency
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      filter.Q.value = 0.5;

      const gain = this.ctx.createGain();
      gain.gain.value = this.volumes.rain * 0.6 * this.volumes.master;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      source.start();
      this.nodes.rain = { source, gain, filter };
    } else {
      this.nodes.rain.gain.gain.setTargetAtTime(
        this.volumes.rain * 0.6 * this.volumes.master,
        this.ctx.currentTime,
        0.1
      );
    }
  }

  // Deep Brown Noise Synthesizer (Ideal for ADHD and deep focus)
  setBrownNoiseVolume(val) {
    this.volumes.brownNoise = val;
    this.updateBrownNoise();
  }

  updateBrownNoise() {
    if (!this.ctx) return;
    if (this.volumes.brownNoise <= 0 || this.isMuted) {
      if (this.nodes.brownNoise) {
        this.nodes.brownNoise.gain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.1);
      }
      return;
    }

    if (!this.nodes.brownNoise) {
      const buffer = this.createNoiseBuffer(5);
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 280;
      filter.Q.value = 1.2;

      const gain = this.ctx.createGain();
      gain.gain.value = this.volumes.brownNoise * 0.7 * this.volumes.master;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      source.start();
      this.nodes.brownNoise = { source, gain, filter };
    } else {
      this.nodes.brownNoise.gain.gain.setTargetAtTime(
        this.volumes.brownNoise * 0.7 * this.volumes.master,
        this.ctx.currentTime,
        0.1
      );
    }
  }

  // Binaural Alpha Beat (10 Hz beat for relaxed alertness)
  setBinauralVolume(val) {
    this.volumes.binaural = val;
    this.updateBinaural();
  }

  updateBinaural() {
    if (!this.ctx) return;
    if (this.volumes.binaural <= 0 || this.isMuted) {
      if (this.nodes.binaural) {
        this.nodes.binaural.gain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.1);
      }
      return;
    }

    if (!this.nodes.binaural) {
      const oscL = this.ctx.createOscillator();
      const oscR = this.ctx.createOscillator();
      const merger = this.ctx.createChannelMerger(2);
      const gain = this.ctx.createGain();

      // 196 Hz in left ear, 206 Hz in right ear = 10 Hz Alpha beat
      oscL.frequency.value = 196;
      oscR.frequency.value = 206;

      const pannerL = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
      const pannerR = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

      if (pannerL && pannerR) {
        pannerL.pan.value = -0.9;
        pannerR.pan.value = 0.9;
        oscL.connect(pannerL);
        oscR.connect(pannerR);
        pannerL.connect(gain);
        pannerR.connect(gain);
      } else {
        oscL.connect(gain);
        oscR.connect(gain);
      }

      gain.gain.value = this.volumes.binaural * 0.3 * this.volumes.master;
      gain.connect(this.ctx.destination);

      oscL.start();
      oscR.start();

      this.nodes.binaural = { oscL, oscR, gain };
    } else {
      this.nodes.binaural.gain.gain.setTargetAtTime(
        this.volumes.binaural * 0.3 * this.volumes.master,
        this.ctx.currentTime,
        0.1
      );
    }
  }

  // Lo-Fi Vinyl Crackle
  setCrackleVolume(val) {
    this.volumes.crackle = val;
    this.updateCrackle();
  }

  updateCrackle() {
    if (!this.ctx) return;
    if (this.volumes.crackle <= 0 || this.isMuted) {
      if (this.nodes.crackle) {
        this.nodes.crackle.gain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.1);
      }
      return;
    }

    if (!this.nodes.crackle) {
      // Create sparse vinyl clicks
      const bufferSize = this.ctx.sampleRate * 3;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() < 0.0008 ? (Math.random() * 2 - 1) : 0;
      }

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 2000;

      const gain = this.ctx.createGain();
      gain.gain.value = this.volumes.crackle * 0.45 * this.volumes.master;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      source.start();
      this.nodes.crackle = { source, gain, filter };
    } else {
      this.nodes.crackle.gain.gain.setTargetAtTime(
        this.volumes.crackle * 0.45 * this.volumes.master,
        this.ctx.currentTime,
        0.1
      );
    }
  }

  // Master volume and mute
  setMasterVolume(val) {
    this.volumes.master = val;
    this.updateRain();
    this.updateBrownNoise();
    this.updateBinaural();
    this.updateCrackle();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.updateRain();
    this.updateBrownNoise();
    this.updateBinaural();
    this.updateCrackle();
    return this.isMuted;
  }
}

export const soundEngine = new SoundEngine();
