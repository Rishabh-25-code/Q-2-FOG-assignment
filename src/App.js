import React, { useEffect, useState } from 'react';
import './App.css';

const GRID_ROWS = 15;
const GRID_COLS = 20;

const App = () => {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [color, setColor] = useState(createRandomColor());
  const [colTimers, setColTimers] = useState(createInitialTimers());

  useEffect(() => {
    const interval = setInterval(() => {
      setGrid(prevGrid => updateGridWithRain(prevGrid, color, colTimers));
      setColTimers(prevTimers => updateTimers(prevTimers));
    }, 100);
    const colorInterval = setInterval(() => {
      setColor(createRandomColor());
    }, 200);
    return () => {
      clearInterval(interval);
      clearInterval(colorInterval);
    };
  }, [colTimers, color]);

  return (
    <div className="app">
      <div className="header">Rain Grid Game</div>
      <div className="grid">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`cell ${cell ? 'rain' : ''}`}
              style={{ backgroundColor: cell || 'black', border: '2px solid grey'}}
            ></div>
          ))
        )}
      </div>
      <div className="instructions">
        Watch the rain fall! Refresh to see a new pattern.
      </div>
    </div>
  );
};

const createEmptyGrid = () => {
  const grid = [];
  for (let i = 0; i < GRID_ROWS; i++) {
    const row = [];
    for (let j = 0; j < GRID_COLS; j++) {
      row.push('');
    }
    grid.push(row);
  }
  return grid;
};

const createRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

const createInitialTimers = () => {
  const timers = [];
  for (let i = 0; i < GRID_COLS; i++) {
    timers.push(Math.floor(Math.random() * 100)); // Start with no delay for any column
  }
  return timers;
};

const updateTimers = (timers) => {
  return timers.map((timer) => (timer > 0 ? timer - 1 : Math.floor(Math.random())));
};

const updateGridWithRain = (grid, color, colTimers) => {
  const newGrid = grid.map(row => [...row]);
  for (let col = 0; col < GRID_COLS; col++) {
    if (colTimers[col] === 0) {
      for (let row = GRID_ROWS - 1; row > 0; row--) {
        newGrid[row][col] = newGrid[row-1][col];
      }
      newGrid[1][col] = color;
    } 
  }
  return newGrid;
};

export default App;
