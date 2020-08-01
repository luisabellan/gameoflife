
import React from 'react'



const NewBoardStatus = (cellStatus = () => Math.random() < 0.5) => {


  const totalBoardRows = 25
  const totalBoardColumns = 25

  const grid = [];
  for (let r = 0; r < totalBoardRows; r++) {
    grid[r] = [];
    for (let c = 0; c < totalBoardColumns; c++) {
      grid[r][c] = cellStatus();
    }
  }
  return grid;
};


export default NewBoardStatus