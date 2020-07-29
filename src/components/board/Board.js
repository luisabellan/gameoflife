import React from 'react'


const Board = ({rows,cols, boardStatus, onToggleCellStatus }) => {
  const handleClick = (r, c) => onToggleCellStatus(r, c);

  const totalBoardRows = 25;
  const totalBoardColumns = 25;

  const tr = [];
  for (let r = 0; r < totalBoardRows; r++) {
    const td = [];
    for (let c = 0; c < totalBoardColumns; c++) {
      td.push(
        <td
          key={`${r},${c}`}
          className={boardStatus[r][c] ? "alive" : "dead"}
          onClick={() => handleClick(r, c)}
        />
      );
    }
    tr.push(<tr key={r}>{td}</tr>);
  }
  return (
    <table>
      <tbody>{tr}</tbody>
    </table>
  );
};

export default Board