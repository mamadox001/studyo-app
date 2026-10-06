import React, { useState, useEffect } from 'react';
import { 
  Headphones, 
  CloudRain, 
  Wind, 
  Radio, 
  Sparkles, 
  X, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Music2, 
  Disc3,
  ExternalLink
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { musicEngine, FOCUS_STATIONS } from '../services/musicEngine';

export default function SoundMixerModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('music'); // 'music' | 'ambience'
  const [musicState, setMusicState] = useState(() => musicEngine.getState());
  const [ambienceVolumes, setAmbienceVolumes] = useState({
    rain: soundEngine.volumes.rain,
    brownNoise: soundEngine.volumes.brownNoise,
    binaural: soundEngine.volumes.binaural,
    crackle: soundEngine.volumes.crackle,
    master: soundEngine.volumes.master,
  });

  useEffect(() => {
    const unsubscribe = musicEngine.subscribe((state) => {
      setMusicState({ ...state });
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const handleSliderChange = (type, val) => {
    const num = parseFloat(val);
    setAmbienceVolumes(prev => ({ ...prev, [type]: num }));

    if (type === 'rain') soundEngine.setRainVolume(num);
    if (type === 'brownNoise') soundEngine.setBrownNoiseVolume(num);
    if (type === 'binaural') soundEngine.setBinauralVolume(num);
    if (type === 'crackle') soundEngine.setCrackleVolume(num);
    if (type === 'master') soundEngine.setMasterVolume(num);
  };

  const handleMusicVolumeChange = (val) => {
    const num = parseFloat(val);
    musicEngine.setVolume(num);
  };

  const handleSelectStation = (station) => {
    soundEngine.playClick();
    musicEngine.setStation(station);
  };

  const handleToggleMusic = () => {
    soundEngine.playClick();
    musicEngine.togglePlay();
  };

  const applyPreset = (presetName) => {
    soundEngine.playClick();
    let newVols = { rain: 0, brownNoise: 0, binaural: 0, crackle: 0, master: 0.7 };
    if (presetName === 'deep-focus') {
      newVols = { rain: 0, brownNoise: 0.6, binaural: 0.45, crackle: 0, master: 0.75 };
    } else if (presetName === 'rainy-library') {
      newVols = { rain: 0.7, brownNoise: 0.25, binaural: 0, crackle: 0.3, master: 0.7 };
    } else if (presetName === 'vinyl-cafe') {
      newVols = { rain: 0.2, brownNoise: 0, binaural: 0, crackle: 0.6, master: 0.7 };
    } else if (presetName === 'mute-all') {
      newVols = { rain: 0, brownNoise: 0, binaural: 0, crackle: 0, master: 0.7 };
      musicEngine.pause();
    }

    setAmbienceVolumes(newVols);
    soundEngine.setRainVolume(newVols.rain);
    soundEngine.setBrownNoiseVolume(newVols.brownNoise);
    soundEngine.setBinauralVolume(newVols.binaural);
    soundEngine.setCrackleVolume(newVols.crackle);
    soundEngine.setMasterVolume(newVols.master);
  };

  const soundChannels = [
    { id: 'rain', label: 'Rain on Glass', icon: CloudRain, desc: 'Synthesized organic rainfall & droplets' },
    { id: 'brownNoise', label: 'Deep Brown Noise', icon: Wind, desc: 'Low-frequency rumble for ADHD & focus' },
    { id: 'binaural', label: '10Hz Alpha Waves', icon: Radio, desc: 'Stereo binaural beats for deep concentration' },
    { id: 'crackle', label: 'Lo-Fi Vinyl Crackle', icon: Sparkles, desc: 'Cozy turntable needle texture' },
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.72)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="glass-panel modal-enter" style={{
        width: '100%',
        maxWidth: '580px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: 'clamp(18px, 3.5vw, 28px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px var(--border-glow)'
            }}>
              <Headphones size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                Focus Music & Ambience
                <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', fontWeight: 700 }}>
                  100% FREE
                </span>
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Unlimited 24/7 Lo-Fi Streams + Web Audio Synthesizer
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-muted)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Toggle: Focus Music vs Synthesizer */}
        <div style={{
          display: 'flex',
          background: 'rgba(0,0,0,0.3)',
          padding: '3px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setActiveTab('music')}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: 700,
              background: activeTab === 'music' ? 'var(--bg-surface-elevated)' : 'transparent',
              color: activeTab === 'music' ? 'var(--text-main)' : 'var(--text-muted)',
              border: activeTab === 'music' ? '1px solid var(--border-focus)' : '1px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.15s ease'
            }}
          >
            <Disc3 size={16} color={activeTab === 'music' ? 'var(--accent-glow)' : 'currentColor'} />
            <span>24/7 Focus Music</span>
          </button>

          <button
            onClick={() => setActiveTab('ambience')}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: 700,
              background: activeTab === 'ambience' ? 'var(--bg-surface-elevated)' : 'transparent',
              color: activeTab === 'ambience' ? 'var(--text-main)' : 'var(--text-muted)',
              border: activeTab === 'ambience' ? '1px solid var(--border-focus)' : '1px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.15s ease'
            }}
          >
            <CloudRain size={16} color={activeTab === 'ambience' ? 'var(--accent-glow)' : 'currentColor'} />
            <span>Ambient Synthesizer</span>
          </button>
        </div>

        {/* TAB 1: MUSIC STATIONS */}
        {activeTab === 'music' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Now Playing Bar */}
            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(6, 182, 212, 0.08))',
              border: '1px solid var(--border-focus)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  {musicState.currentStation.icon}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                    {musicState.currentStation.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: musicState.isPlaying ? '#22c55e' : '#f59e0b',
                      boxShadow: musicState.isPlaying ? '0 0 6px #22c55e' : 'none'
                    }} />
                    <span>{musicState.isPlaying ? 'Streaming Live' : 'Paused'}</span>
                    <span>•</span>
                    <span>{musicState.currentStation.genre}</span>
                  </div>
                </div>
              </div>

              {/* Play / Pause Button */}
              <button
                onClick={handleToggleMusic}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--accent-ivory)',
                  color: '#121212',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(245, 239, 230, 0.25)',
                  flexShrink: 0,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {musicState.isPlaying ? (
                  <Pause size={17} fill="#121212" />
                ) : (
                  <Play size={17} fill="#121212" style={{ marginLeft: '2px' }} />
                )}
              </button>
            </div>

            {/* Music Volume Slider */}
            <div style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Volume2 size={16} color="var(--text-muted)" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={musicState.volume}
                onChange={(e) => handleMusicVolumeChange(e.target.value)}
                style={{ flex: 1, accentColor: 'var(--accent-primary)' }}
              />
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', width: '32px' }}>
                {Math.round(musicState.volume * 100)}%
              </span>
            </div>

            {/* YouTube Live Embed preview (when YouTube stream selected) */}
            {musicState.currentStation.type === 'youtube' && (
              <div style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
                background: '#000000',
                position: 'relative',
                paddingTop: '56.25%', // 16:9 ratio
                width: '100%'
              }}>
                <iframe
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  src={`https://www.youtube-nocookie.com/embed/${musicState.currentStation.ytId}?autoplay=${musicState.isPlaying ? 1 : 0}&enablejsapi=1`}
                  title={musicState.currentStation.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* List of Stations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Choose Station (Free 24/7)
              </div>
              {FOCUS_STATIONS.map((station) => {
                const isSelected = musicState.currentStation.id === station.id;
                return (
                  <button
                    key={station.id}
                    onClick={() => handleSelectStation(station)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--bg-surface-elevated)' : 'rgba(255, 255, 255, 0.02)',
                      border: isSelected ? '1.5px solid var(--accent-glow)' : '1px solid var(--border-subtle)',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '20px' }}>{station.icon}</span>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                          {station.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                          {station.subtitle}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: 'var(--text-muted)'
                      }}>
                        {station.type === 'youtube' ? 'Video Stream' : 'Live Radio'}
                      </span>
                      {isSelected && (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: 'var(--accent-glow)',
                          boxShadow: '0 0 8px var(--accent-glow)'
                        }} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: AMBIENCE SYNTHESIZER */}
        {activeTab === 'ambience' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Quick Presets */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => applyPreset('deep-focus')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                🧠 Deep Alpha
              </button>
              <button
                onClick={() => applyPreset('rainy-library')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                🌧️ Rainy Library
              </button>
              <button
                onClick={() => applyPreset('vinyl-cafe')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                ☕ Vinyl Café
              </button>
              <button
                onClick={() => applyPreset('mute-all')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: '#f87171',
                  cursor: 'pointer'
                }}
              >
                Silence All
              </button>
            </div>

            {/* Channels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {soundChannels.map(channel => {
                const Icon = channel.icon;
                const currentVal = ambienceVolumes[channel.id];
                return (
                  <div
                    key={channel.id}
                    style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon size={16} color="var(--accent-glow)" />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                            {channel.label}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                            {channel.desc}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        {Math.round(currentVal * 100)}%
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={currentVal}
                      onChange={(e) => handleSliderChange(channel.id, e.target.value)}
                      style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
