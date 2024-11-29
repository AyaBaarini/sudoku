interface Props {
  cellValue: number;
  isEditable: boolean;
  className?: string;
  onChange: (newCellValue: number) => void;
}

function Cell({ cellValue, isEditable, className, onChange }: Props) {
  //ensure that the input value is between 1 and 9
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0 && value <= 9) {
      onChange(value);
    } else if (e.target.value === "") {
      onChange(0);
    }
  }
  return (
    <>
      <input
        className={`cell ${isEditable && "editable-cell"} ${className || ""}`}
        type="number"
        value={cellValue === 0 ? "" : cellValue}
        onChange={handleChange}
        disabled={!isEditable}
        min="0"
        max="9"
      ></input>
    </>
  );
}

export default Cell;
