import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';
import { Track } from '../types';

const TRACKS: Track[] = [
  { id: '1', title: 'Cybernetic Pulse', artist: 'AI Gen Alpha', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '2', title: 'Neon Grid Runner', artist: 'AI Gen Beta', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: '3', title: 'Synthwave Dreams', artist: 'AI Gen Gamma', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => {
        console.error("Audio playback failed:", e);
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    handleNext();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  return (
    <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-sm border border-neon-blue rounded-xl p-6 shadow-[0_0_20px_rgba(0,255,255,0.15)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-neon-pink flex items-center justify-center shadow-[0_0_10px_rgba(255,0,255,0.3)]">
            <Music className="text-neon-pink w-6 h-6" />
          </div>
          <div>
            <h3 className="text-neon-blue font-bold tracking-wide text-lg">{currentTrack.title}</h3>
            <p className="text-gray-400 text-sm">{currentTrack.artist}</p>
          </div>
        </div>
        
        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-neon-blue transition-colors">
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-blue"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className="w-full h-2 bg-gray-800 rounded-full mb-6 cursor-pointer overflow-hidden"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-neon-pink shadow-[0_0_10px_rgba(255,0,255,0.5)] transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-8">
        <button 
          onClick={handlePrev}
          className="text-gray-400 hover:text-neon-blue transition-colors hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]"
        >
          <SkipBack className="w-8 h-8" />
        </button>
        <button 
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-gray-800 border-2 border-neon-blue flex items-center justify-center text-neon-blue hover:bg-neon-blue hover:text-black transition-all shadow-[0_0_15px_rgba(0,255,255,0.4)] hover:shadow-[0_0_25px_rgba(0,255,255,0.6)]"
        >
          {isPlaying ? <Pause className="w-6 h-6 ml-0" /> : <Play className="w-6 h-6 ml-1" />}
        </button>
        <button 
          onClick={handleNext}
          className="text-gray-400 hover:text-neon-blue transition-colors hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]"
        >
          <SkipForward className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
