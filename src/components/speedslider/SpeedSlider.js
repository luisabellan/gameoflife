import React from 'react'



const SpeedSlider = ({ speed, onSpeedChange }) => {
  const handleChange = (e) => onSpeedChange(e.target.value);

  return (
    <div className="sliders">
    <label for="speedslider">Speed:</label>
      <input
        id="speedslider"
        type="range"
        name="speed"
        min="1"
        max="1000"
        step="50"
        value={speed}
        onChange={handleChange}
      />
    </div>
  );
};





export default SpeedSlider