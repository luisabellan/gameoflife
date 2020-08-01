import React from 'react'


const ColsSlider = ({ cols, onColsChange }) => {
  const handleChange = (e) => onColsChange(e.target.value);

  return (
    <div className="sliders">
    <label for="colslider">Cols:</label>
      <input
        id="colslider"
        type="range"
        name="cols"
        min="25"
        max="100"
        step="5"
        value={(cols)}
        onChange={handleChange}
      />
    </div>
  );
};



export default ColsSlider