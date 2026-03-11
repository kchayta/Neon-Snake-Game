import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('snakeHighScore', newScore.toString());
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-neon-pink selection:text-white flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none"></div>

      <div className="z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Title & Music Player */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-br from-neon-green via-neon-blue to-neon-pink drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] mb-2">
              Neon Snake
            </h1>
            <p className="text-gray-400 tracking-widest uppercase text-sm font-bold">
              & Beats
            </p>
          </div>

          <MusicPlayer />
          
          <div className="hidden lg:block text-gray-500 text-sm max-w-xs">
            <p className="mb-2"><strong className="text-neon-green">Controls:</strong></p>
            <ul className="space-y-1">
              <li><kbd className="bg-gray-800 px-2 py-1 rounded text-gray-300">W A S D</kbd> or <kbd className="bg-gray-800 px-2 py-1 rounded text-gray-300">Arrows</kbd> to move</li>
              <li><kbd className="bg-gray-800 px-2 py-1 rounded text-gray-300">Space</kbd> to pause/resume</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Game & Score */}
        <div className="lg:col-span-7 flex flex-col items-center space-y-6">
          
          {/* Score Board */}
          <div className="flex space-x-8 bg-gray-900/50 border border-gray-800 rounded-2xl px-8 py-4 backdrop-blur-md">
            <div className="text-center">
              <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-1">Score</p>
              <p className="text-3xl font-mono text-neon-green drop-shadow-[0_0_8px_rgba(0,255,0,0.5)]">{score}</p>
            </div>
            <div className="w-px bg-gray-800"></div>
            <div className="text-center">
              <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-1">High Score</p>
              <p className="text-3xl font-mono text-neon-pink drop-shadow-[0_0_8px_rgba(255,0,255,0.5)]">{highScore}</p>
            </div>
          </div>

          {/* Game Container */}
          <div className="w-full flex justify-center">
            <SnakeGame onScoreChange={handleScoreChange} />
          </div>

          <div className="lg:hidden text-gray-500 text-sm text-center">
            <p>Swipe or use arrow keys to play.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
