import React from 'react'


const RowsSlider = ({ rows, onRowsChange }) => {
  const handleChange = (e) => onRowsChange(e.target.value);

  return (
    <div className="sliders">
    <label for="rowslider">Rows:</label>
      <input
        id="rowslider"
        type="range"
        name="rows"
        min="25"
        max="100"
        step="5"
        value={rows}
        onChange={handleChange}
      />
    </div>
  );
};



export default RowsSlider