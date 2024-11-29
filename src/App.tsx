import Board from "./components/Board";
// import OCRReader from "./components/OCRReader";

function App() {
  return (
    <div className="App">
      <div className="header">
        <h1>Sudoku</h1>
      </div>
      <Board />
      {/* <div>
        <OCRReader />
      </div> */}
    </div>
  );
}

export default App;
