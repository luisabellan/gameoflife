import React, { Component } from "react";
import Board from './components/board/Board'
import SpeedSlider from './components/speedslider/SpeedSlider'
import RowsSlider from './components/size-sliders/RowsSlider'
import ColsSlider from './components/size-sliders/ColsSlider'

const totalBoardRows = 25
const totalBoardColumns = 25

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







class App extends Component {
	state = {
		boardStatus: NewBoardStatus(),
		generation: 0,
		isGameRunning: false,
    speed: 900
   
	};

	startStop = () => {
		return this.state.isGameRunning ? (
			<button className="button" type="button" onClick={this.handleStop}>
      <p>Stop</p>
			</button>
		) : (
				<button className="button" type="button" onClick={this.handleRun}>
					<p>Start</p>
				</button>
			);
	};

	clear = () => {
		this.setState({
			boardStatus: NewBoardStatus(() => false),
			generation: 0,
		});
	};

	handleNewBoard = () => {
		this.setState({
			boardStatus: NewBoardStatus(),
      generation: 0,
     
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

  handleRowsChange = (newRows) => {
    this.setState({ rows: newRows });
  };

  handleColsChange = (newCols) => {
    this.setState({ cols: newCols });
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
    const rowsChanged = prevState.rows !== rows;
    const colsChanged = prevState.cols !== cols;
    const gameStarted = !prevState.isGameRunning && isGameRunning;
    const gameStopped = prevState.isGameRunning && !isGameRunning;

    if ((isGameRunning && speedChanged && rowsChanged && colsChanged) || gameStopped) {
      clearInterval(this.timerID);
    }

    if ((isGameRunning && speedChanged && rowsChanged && colsChanged) || gameStarted) {
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

        <div className='board'>
          <Board
            rows={rows}
            cols={cols}
            boardStatus={boardStatus}
            onToggleCellStatus={this.handleToggleCellStatus}
          />
        </div>

        <div className="sliders">
          
          <SpeedSlider speed={speed} onSpeedChange={this.handleSpeedChange} />
          {/* <RowsSlider rows={rows} onRowsChange={this.handleRowsChange} />
          <ColsSlider cols={cols} onColsChange={this.handleColsChange} />
           
        */}
        </div>

        <div className="buttons">
          {this.startStop()}
          <button
          className="button"
            type="button"
            disabled={isGameRunning}
            onClick={this.handleStep}
          >
						<p>Step</p>
          </button>

         

          <button className="button" type="button" disabled={isGameRunning}
          onClick={this.handleNSteps}>
          <p>10 Steps</p>
          </button>
          
          <button className="button" type="button" onClick={this.clear}>
            <p>Clear</p>
          </button>
          <button className="button" type="button" onClick={this.handleNewBoard}>
            <p>New</p>
          </button>
        </div>


        <div className="about">
        <h1>About</h1>
        <p>The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970.</p>
        </div>
        <div className="rules">
          <h1>Rules</h1>
          <ol>
            <li>Any live cell with two or three live neighbours survives.</li>
            <li>Any dead cell with three live neighbours becomes a live cell.</li>
            <li>All other live cells die in the next generation. Similarly, all other dead cells stay dead.</li>
          </ol>
        </div>
      </div>
    );
  }
}

export default App;