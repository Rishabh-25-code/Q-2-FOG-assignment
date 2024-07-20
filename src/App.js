import React, { useEffect, useState, useRef } from 'react';
import './App.css';

const rows = 15;
const cols = 20;

const App = () => {
  const [grid, setGrid] = useState([]);
  const dropsRef = useRef([]);
  const [currentColor, setCurrentColor] = useState('red');
  const [colorChangeCount, setColorChangeCount] = useState(0);

  useEffect(() => {
    const createGrid = () => {
      let newGrid = [];
      for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
          row.push({ color: 'black', falling: false });
        }
        newGrid.push(row);
      }
      setGrid(newGrid);
    };

    createGrid();
  }, []);

  useEffect(() => {
    const dropRain = () => {
      setGrid(prevGrid => {
        let newGrid = prevGrid.map(row => row.map(cell => ({ ...cell, color: 'black', falling: false })));

        for (let i = dropsRef.current.length - 1; i >= 0; i--) {
          const drop = dropsRef.current[i];
          if (drop.row < rows - 1) {
            newGrid[drop.row][drop.col].color = 'black';
            newGrid[drop.row][drop.col].falling = false;
            drop.row++;
            newGrid[drop.row][drop.col].color = drop.color;
            newGrid[drop.row][drop.col].falling = true;
          } else {
            dropsRef.current.splice(i, 1);
          }
        }

        if (dropsRef.current.every(drop => drop.row > 0) || dropsRef.current.length === 0) {
          const randomCol = Math.floor(Math.random() * cols);
          const dropColor = currentColor;
        
          let rgb = [255, 0, 0]; 

          if (dropColor.startsWith('rgb')) {
            const match = dropColor.match(/\d+/g);
            if (match && match.length === 3) {
              rgb = match.map(Number);
            }
          }
          
          for (let i = 0; i < 6; i++) {
            const colorDensity = i / 6;
        
            const fadedColor = `rgb(${Math.floor(rgb[0] * colorDensity)}, ${Math.floor(rgb[1] * colorDensity)}, ${Math.floor(rgb[2] * colorDensity)})`;
        
            newGrid[i][randomCol].color = fadedColor;
            newGrid[i][randomCol].falling = true;
            dropsRef.current.push({ row: i, col: randomCol, color: fadedColor });
          }
        }

        return newGrid;
      });
    };

    const interval = setInterval(dropRain, 200);
    return () => clearInterval(interval);
  }, [currentColor]);

  useEffect(() => {
    const changeColorInterval = setInterval(() => {
      const newColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
      setCurrentColor(newColor);
      setColorChangeCount(colorChangeCount + 1);
    }, 3000);

    return () => clearInterval(changeColorInterval);
  }, [colorChangeCount]);

  return (
    <div className='app'>
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className = 'cell'
                style={{ backgroundColor: cell.color }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
