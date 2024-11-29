import { useState, useEffect } from "react";
// import Tesseract from "tesseract.js";
import Cell from "./Cell";
import Alert from "./Alert";
// import "../index.css";

function Board() {
  const [removedCellsTable, setRemovedCellsTable] = useState<
    { row: number; col: number }[]
  >([]);

  const [board, setBoard] = useState<number[][]>(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(0))
  );
  const [alertVisible, setAlertVisibility] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "danger" | "warning">(
    "success"
  );
  const [alertMessage, setAlertMessage] = useState("");

  const [difficulty, setDifficulty] = useState("easy");

  const [hintedCell, setHintedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const [isCustomizing, setIsCustomizing] = useState(false);

  function hasDuplicates(array: number[]) {
    const filteredArray = array.filter((num) => num !== 0);
    const uniqueNumbers = new Set(filteredArray);
    return uniqueNumbers.size !== filteredArray.length;
  }
  function isRowValid(board: number[][], rowIndex: number) {
    return !hasDuplicates(board[rowIndex]);
  }

  function isColumnValid(board: number[][], colIndex: number) {
    const column = board.map((row) => row[colIndex]);
    return !hasDuplicates(column);
  }

  function isSubGridValid(
    board: number[][],
    startRow: number,
    startCol: number
  ): boolean {
    const subGrid = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        subGrid.push(board[startRow + i][startCol + j]);
      }
    }
    return !hasDuplicates(subGrid);
  }

  function isCellInvalid(rowIndex: number, colIndex: number): boolean {
    const startRowIndex = Math.floor(rowIndex / 3) * 3;
    const startColIndex = Math.floor(colIndex / 3) * 3;
    return (
      !isRowValid(board, rowIndex) ||
      !isColumnValid(board, colIndex) ||
      !isSubGridValid(board, startRowIndex, startColIndex)
    );
  }

  function handleCellChange(
    rowIndex: number,
    colIndex: number,
    newCellValue: number
  ) {
    const newBoard = [...board];
    newBoard[rowIndex] = [...newBoard[rowIndex]];
    newBoard[rowIndex][colIndex] = newCellValue;
    setBoard(newBoard);
  }

  function validateBoard() {
    const invalidCells: { row: number; col: number }[] = [];
    let hasEmptyCells = false;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cellValue = board[row][col];
        if (cellValue === 0) {
          hasEmptyCells = true;
        }
        const isValidRow = isRowValid(board, row);
        const isValidColumn = isColumnValid(board, col);
        const isValidSubGrid = isSubGridValid(
          board,
          Math.floor(row / 3) * 3,
          Math.floor(col / 3) * 3
        );

        if (!isValidRow || !isValidColumn || !isValidSubGrid) {
          invalidCells.push({ row, col });
        }
      }
    }
    if (hasEmptyCells) {
      setAlertMessage("Please fill all cells. No cell should be empty!");
      setAlertType("warning");
      setAlertVisibility(true);
      return;
    }

    if (invalidCells.length === 0) {
      setAlertMessage("Congratulations! The solution is valid!");
      setAlertType("success");
    } else {
      setAlertMessage(
        "The solution is invalid. Please correct the highlighted cells."
      );
      setAlertType("danger");
    }

    setAlertVisibility(true);
  }

  function isValid(
    board: number[][],
    row: number,
    col: number,
    num: number
  ): boolean {
    // Check row
    for (let j = 0; j < 9; j++) {
      if (j !== col && board[row][j] === num) return false;
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (i !== row && board[i][col] === num) return false;
    }

    // Check 3x3 subgrid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if ((i !== row || j !== col) && board[i][j] === num) return false;
      }
    }

    return true;
  }

  function solveBoard(board: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          // Empty cell
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solveBoard(board)) return true;
              board[row][col] = 0; // Backtrack
            }
          }
          return false; // No valid number found, need to backtrack
        }
      }
    }
    return true; // Puzzle solved
  }

  function shuffleArray<T>(array: T[]): T[] {
    // Fisher-Yates Shuffle
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function shuffleSudoku(board: number[][]): number[][] {
    const newBoard = board.map((row) => [...row]);

    //  Shuffle rows within each block
    for (let blockStart = 0; blockStart < 9; blockStart += 3) {
      const rows = [0, 1, 2].map((i) => newBoard[blockStart + i]);
      const shuffledRows = shuffleArray(rows);
      for (let i = 0; i < 3; i++) {
        newBoard[blockStart + i] = shuffledRows[i];
      }
    }

    // Shuffle columns within each block
    for (let blockStart = 0; blockStart < 9; blockStart += 3) {
      const cols = [0, 1, 2];
      const shuffledCols = shuffleArray(cols);
      for (let i = 0; i < 3; i++) {
        for (let row = 0; row < 9; row++) {
          const temp = newBoard[row][blockStart + i];
          newBoard[row][blockStart + i] =
            newBoard[row][blockStart + shuffledCols[i]];
          newBoard[row][blockStart + shuffledCols[i]] = temp;
        }
      }
    }
    return newBoard;
  }

  function generateCompleteBoard(): number[][] {
    const board = Array(9)
      .fill(null)
      .map(() => Array(9).fill(0));
    const success = solveBoard(board);

    if (!success) {
      console.error("Failed to generate a complete Sudoku board!");
    }
    return shuffleSudoku(board);
  }

  function removeNumbersForDifficulty(
    board: number[][],
    level: string
  ): number[][] {
    setRemovedCellsTable([]);
    console.log("removeNumbersForDifficulty called, chosen level is", level);
    const filledCells = level === "easy" ? 50 : level === "medium" ? 40 : 30;

    const cellsToRemove = 81 - filledCells;
    let removedCells = 0;
    const newRemovedCells: { row: number; col: number }[] = [];

    while (removedCells < cellsToRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (board[row][col] !== 0) {
        board[row][col] = 0; // Remove number
        newRemovedCells.push({ row, col });
        removedCells++;
      }
    }
    setRemovedCellsTable(newRemovedCells);
    console.log(newRemovedCells);

    return board;
  }

  function generatePuzzle(diff: string): number[][] {
    const completeBoard = generateCompleteBoard(); // Generate a complete board
    console.log("generatePuzzle called the difficulty is ", diff);
    return removeNumbersForDifficulty(completeBoard, diff); // Remove numbers to create the puzzle
  }

  useEffect(() => {
    console.log(`The difficulty has changed to: ${difficulty}`);
    const newBoard = generatePuzzle(difficulty); // Generate the puzzle when the difficulty changes
    setBoard(newBoard); // Update the board
  }, [difficulty]);

  const handleDifficultyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newDifficulty = event.target.value;
    console.log("e.target.value is", event.target.value);
    // Update the difficulty state

    console.log(
      `handleDifficultyChange current is  ${difficulty} and newDificulty is ${newDifficulty}`
    );
    setDifficulty(newDifficulty);
  };

  function provideHint() {
    const hiddenSolvedBoard = [...board].map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        return removedCellsTable.some(
          (removedCell) =>
            removedCell.row === rowIndex && removedCell.col === colIndex
        )
          ? 0
          : cell;
      })
    );
    const isHiddenBoardSolved = solveBoard(hiddenSolvedBoard);

    if (isHiddenBoardSolved) {
      const editableCells: { row: number; col: number; value: number }[] = [];
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (
            // removedCellsTable.some(
            //   (cell) => cell.row === row && cell.col === col
            // ) &&
            board[row][col] != hiddenSolvedBoard[row][col]
          ) {
            editableCells.push({
              row,
              col,
              value: hiddenSolvedBoard[row][col],
            });
          }
        }
      }

      // Select a random editable cell
      if (editableCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * editableCells.length);
        const randomCell = editableCells[randomIndex];

        // Provide the hint for the randomly selected cell
        const { row, col, value } = randomCell;

        setHintedCell({ row, col });
        const newBoard = [...board];
        newBoard[row][col] = value;
        setBoard(newBoard);

        setTimeout(() => {
          setHintedCell(null);
        }, 500);
      } else {
        setAlertMessage("No editable cells available for hint.");
        setAlertType("warning");
        setAlertVisibility(true);
      }
    } else {
      setAlertMessage("The puzzle cannot be solved!");
      setAlertType("danger");
      setAlertVisibility(true);
    }
  }

  function customizeSudoku() {
    const emptyBoard = Array(9)
      .fill(null)
      .map(() => Array(9).fill(0));
    const allCells = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        allCells.push({ row, col });
      }
    }
    setBoard(emptyBoard);
    setRemovedCellsTable(allCells);
    setIsCustomizing(true);
  }

  function doneCustomizing() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (
          board[row][col] != 0 &&
          !isValid(board, row, col, board[row][col])
        ) {
          setAlertMessage("make sure cells are valid ");
          setAlertType("danger");
          setAlertVisibility(true);
          return;
        }
      }
    }
    setIsCustomizing(false);
    setRemovedCellsTable(
      removedCellsTable.filter(({ row, col }) => board[row][col] === 0)
    );
    const custumizedBoard = board.map((_, rowIndex) => [...board[rowIndex]]);
    if (solveBoard(custumizedBoard)) {
      setAlertMessage("Customization completed!");
      setAlertType("success");
      setAlertVisibility(true);
    } else {
      setAlertMessage("This board is not solvable ");
      setAlertType("warning");
      setAlertVisibility(true);
    }
  }

  return (
    <div>
      <div>
        {alertVisible && (
          <Alert
            message={alertMessage}
            type={alertType}
            onClose={() => setAlertVisibility(false)}
          />
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: "5%",
          margin: "auto",
        }}
      >
        <div className="board-and-buttons">
          <div className="board">
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="roww">
                {row.map((cellValue, colIndex) => {
                  const isInvalid = isCellInvalid(rowIndex, colIndex);
                  const isHinted =
                    hintedCell?.row === rowIndex &&
                    hintedCell?.col === colIndex;
                  return (
                    <Cell
                      key={`${rowIndex}-${colIndex}`}
                      cellValue={cellValue}
                      isEditable={removedCellsTable.some(
                        (cell) => cell.row === rowIndex && cell.col === colIndex
                      )}
                      onChange={(newValue) =>
                        handleCellChange(rowIndex, colIndex, newValue)
                      }
                      className={`${isInvalid ? "cellInvalid" : ""} ${
                        isHinted ? "hinted-cell" : ""
                      } `}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="btns">
            <div className="hint-btn">
              <button className="hint-btn" onClick={provideHint}>
                Hint
              </button>
            </div>
            <div className="checkSolBtn">
              <button className="check-sol-btn" onClick={validateBoard}>
                Check Solution
              </button>
            </div>
            <div className="solveBtn">
              <button
                className="solve-btn"
                onClick={() => {
                  const cleanedBoard = [...board].map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                      // Check if this cell belongs to removedCellsTable (user input cell)
                      return removedCellsTable.some(
                        (removedCell) =>
                          removedCell.row === rowIndex &&
                          removedCell.col === colIndex
                      )
                        ? 0
                        : cell;
                    })
                  );
                  const solvedBoard = [...cleanedBoard];
                  const isSolved = solveBoard(solvedBoard);
                  if (isSolved) {
                    setBoard(solvedBoard);
                    setAlertMessage("Sudoku solved successfully!");
                    setAlertType("success");
                  } else {
                    setAlertMessage("The puzzle cannot be solved!");
                    setAlertType("danger");
                  }
                  setAlertVisibility(true);
                }}
              >
                solve
              </button>
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: "auto",
            marginBottom: "auto",
            textAlign: "center",
          }}
        >
          <h1 style={{ color: "#395886" }}>New Game</h1>
          <div>
            <div onChange={handleDifficultyChange}>
              <label style={{ backgroundColor: "#b1c9ef" }}>
                <input
                  type="radio"
                  name="difficulty"
                  value="easy"
                  defaultChecked
                />
                Easy
              </label>
              <label style={{ backgroundColor: "#8aaee0" }}>
                <input type="radio" name="difficulty" value="medium" />
                Medium
              </label>
              <label style={{ backgroundColor: "#628ecb" }}>
                <input type="radio" name="difficulty" value="hard" />
                Hard
              </label>
            </div>
            <div>
              {!isCustomizing ? (
                <button className="custom-sudoku-btn" onClick={customizeSudoku}>
                  Customize Your Own Sudoku
                </button>
              ) : (
                <button className="custom-sudoku-btn" onClick={doneCustomizing}>
                  Done Customization
                </button>
              )}
            </div>
            {/* <div>
              <input type="file" accept="image/*" onChange={handleFileUpload} />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Board;
