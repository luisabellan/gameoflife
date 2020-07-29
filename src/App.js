import React, { Component } from "react";
import Board from './components/board/Board'
import SpeedSlider from './components/speedslider/SpeedSlider'

const totalBoardColumns = 25
const totalBoardRows = 25

const NewBoardStatus = (cellStatus = () => Math.random() < 0.5) => {

  const grid = [];
  for (let r = 0; r < totalBoardRows; r++) {
    grid[r] = [];
    for (let c = 0; c < totalBoardColumns; c++) {
      grid[r][c] = cellStatus();
    }
  }
  return grid;
};




// TODO: add size slider here

const SizeSlider = ({ size, onSizeChange }) => {
  const handleChange = (e) => onSizeChange(e.target.value);

  return (
    <div className="sliders">
      <input
        type="range"
        name="size"
        min="1"
        max="1000"
        step="5"
        value={(size)}
        onChange={handleChange}
      />
    </div>
  );
};







class App extends Component {
	state = {
		boardStatus: NewBoardStatus(),
		generation: 0,
		isGameRunning: false,
    speed: 900,
    totalBoardRows: 25,
    totalBoardColumns: 25
	};

	startStop = () => {
		return this.state.isGameRunning ? (
			<button type="button" onClick={this.handleStop}>
				Stop
			</button>
		) : (
				<button type="button" onClick={this.handleRun}>
					Start
				</button>
			);
	};

	clear = () => {
		this.setState({
			boardStatus: NewBoardStatus(() => false),
			generation: 0,
		});
	};

	handleNewBoard = (size=25) => {
		this.setState({
			boardStatus: NewBoardStatus(),
      generation: 0,
      size:size
		});
	};

	handleToggleCellStatus = (r, c) => {
		const toggleBoard = (prevState) => {
			const nextBoard = JSON.parse(
				JSON.stringify(prevState.boardStatus)
			);
			nextBoard[r][c] = !nextBoard[r][c];
			return nextBoard;
		};

		this.setState((prevState) => ({
			boardStatus: toggleBoard(prevState),
		}));
	};

	handleStep = (n = 1) => {
		const nextStep = (prevState) => {
			const boardStatus = prevState.boardStatus;

      /* Must deep clone boardStatus to avoid modifying it by reference when updating nextBoard.
			Can't use `const nextBoard = [...boardStatus]`
			because Spread syntax effectively goes one level deep while copying an array. 
			Therefore, it may be unsuitable for copying multidimensional arrays.
			Note: JSON.parse(JSON.stringify(obj)) doesn't work if the cloned object uses functions */
			const nextBoard = JSON.parse(JSON.stringify(boardStatus));

			const amountTrueNeighbors = (r, c) => {
				const neighbors = [
					[-1, -1],
					[-1, 0],
					[-1, 1],
					[0, 1],
					[1, 1],
					[1, 0],
					[1, -1],
					[0, -1],
				];
				
				return neighbors.reduce((trueNeighbors, neighbor) => {
					const x = r + neighbor[0];
					const y = c + neighbor[1];
					const isNeighborOnBoard =
						x >= 0 && x < totalBoardRows && y >= 0 && y < totalBoardColumns;
					/* 4 alive neighbours */
					if (trueNeighbors < 4 && isNeighborOnBoard && boardStatus[x][y]) {
						return trueNeighbors + 1;
					} else {
						return trueNeighbors;
					}
				}, 0);
      };
      
				for (let r = 0; r < totalBoardRows; r++) {
					for (let c = 0; c < totalBoardColumns; c++) {
						const totalTrueNeighbors = amountTrueNeighbors(r, c);

						if (!boardStatus[r][c]) {
							if (totalTrueNeighbors === 3) nextBoard[r][c] = true;
						} else {
							if (totalTrueNeighbors < 2 || totalTrueNeighbors > 3)
								nextBoard[r][c] = false;
						}
					}
				}

			return nextBoard;
		};

		this.setState((prevState) => ({
			boardStatus: nextStep(prevState),
			generation: prevState.generation + 1,
		}));
  

  };


	handleNSteps = () => {

    for (let i = 0; i < 10; i++) {
      console.log("Hello")
      this.handleStep();
    }
  }




  handleStepsChange = (newSteps) => {
    this.setState({ steps: newSteps });
  };


  handleSpeedChange = (newSpeed) => {
    this.setState({ speed: newSpeed });
  };
  handleSizeChange = (newRows, newCols) => {
    this.setState({ rows: newRows, cols: newCols });
  };


  handleRun = () => {
    this.setState({ isGameRunning: true });
  };

  handleStop = () => {
    this.setState({ isGameRunning: false });
  };

  componentDidUpdate(prevProps, prevState) {
    const { isGameRunning, speed, rows, cols } = this.state;
    const speedChanged = prevState.speed !== speed;
    const sizeChanged = prevState.rows !== rows || prevState.cols !== cols;
    const gameStarted = !prevState.isGameRunning && isGameRunning;
    const gameStopped = prevState.isGameRunning && !isGameRunning;

    if ((isGameRunning && speedChanged) || gameStopped) {
      clearInterval(this.timerID);
    }

    if ((isGameRunning && speedChanged) || gameStarted) {
      this.timerID = setInterval(() => {
        this.handleStep();
      }, speed);
    }
  }

  render() {
    const { boardStatus, isGameRunning, generation, speed, rows, cols } = this.state;

    return (
      <div className='wrapper'>
        <h1>Connaway&apos;s Game of Life</h1>
        <h2>{`Generation: ${generation}`}</h2>
        <Board
          rows={rows}
          cols={cols}
          boardStatus={boardStatus}
          onToggleCellStatus={this.handleToggleCellStatus}
        />
        <div className="upperControls">
          <label>Speed:</label>
          <span>
            
            <SpeedSlider speed={speed} onSpeedChange={this.handleSpeedChange} />
          </span>
        
       
          <label>Size:</label>
          <span>
            
            <SizeSlider rows={rows}  cols={cols}  onSizeChange={this.handleSizeChange} />
           
          </span>
        </div>
        <div className="buttons">
          {this.startStop()}
          <button
            type="button"
            disabled={isGameRunning}
            onClick={this.handleStep}
          >
						Step
          </button>

         

          <button type="button" disabled={isGameRunning}
          onClick={this.handleNSteps}>
          10 Steps
          </button>
          
          <button type="button" onClick={this.clear}>
            Clear Board
          </button>
          <button type="button" onClick={this.handleNewBoard}>
            New Board
          </button>
        </div>
      </div>
    );
  }
}

export default App;
