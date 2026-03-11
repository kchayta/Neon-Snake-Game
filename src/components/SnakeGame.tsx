import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 120;

type Point = { x: number; y: number };

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef(direction);
  const touchStartRef = useRef<Point | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    onScoreChange(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameOver) resetGame();
        else setIsPaused(p => !p);
        return;
      }

      if (gameOver || isPaused) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check collision with food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            onScoreChange(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        setDirection(directionRef.current);
        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [gameOver, isPaused, food, generateFood, onScoreChange]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || gameOver || isPaused) return;

    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;

    const dx = touchEndX - touchStartRef.current.x;
    const dy = touchEndY - touchStartRef.current.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      if (Math.abs(dx) > 30) {
        if (dx > 0 && directionRef.current.x !== -1) {
          directionRef.current = { x: 1, y: 0 };
        } else if (dx < 0 && directionRef.current.x !== 1) {
          directionRef.current = { x: -1, y: 0 };
        }
        touchStartRef.current = null;
      }
    } else {
      // Vertical swipe
      if (Math.abs(dy) > 30) {
        if (dy > 0 && directionRef.current.y !== -1) {
          directionRef.current = { x: 0, y: 1 };
        } else if (dy < 0 && directionRef.current.y !== 1) {
          directionRef.current = { x: 0, y: -1 };
        }
        touchStartRef.current = null;
      }
    }
  };

  return (
    <div 
      className="relative w-full max-w-md aspect-square bg-gray-950 border-2 border-neon-green rounded-lg shadow-[0_0_15px_rgba(0,255,0,0.3)] overflow-hidden touch-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Grid */}
      <div 
        className="absolute inset-0 grid"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Food */}
        <div 
          className="bg-neon-pink rounded-full shadow-[0_0_10px_rgba(255,0,255,0.8)]"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
            transform: 'scale(0.8)'
          }}
        />
        
        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={`${segment.x}-${segment.y}-${index}`}
            className={`${index === 0 ? 'bg-neon-green' : 'bg-neon-green/80'} shadow-[0_0_8px_rgba(0,255,0,0.5)]`}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
              borderRadius: index === 0 ? '4px' : '2px',
              transform: 'scale(0.9)'
            }}
          />
        ))}
      </div>

      {/* Overlays */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-neon-green">
          <h2 className="text-4xl font-bold mb-4 tracking-widest text-shadow-neon">GAME OVER</h2>
          <p className="text-xl mb-6">Score: {score}</p>
          <button 
            onClick={resetGame}
            className="px-6 py-2 border border-neon-green text-neon-green hover:bg-neon-green hover:text-black transition-colors rounded uppercase tracking-wider font-bold"
          >
            Play Again
          </button>
        </div>
      )}

      {isPaused && !gameOver && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-neon-blue">
          <h2 className="text-3xl font-bold tracking-widest text-shadow-neon-blue">PAUSED</h2>
        </div>
      )}
    </div>
  );
}
