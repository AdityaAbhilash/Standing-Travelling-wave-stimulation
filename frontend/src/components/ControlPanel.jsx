import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const ControlPanel = ({ 
  v1, setV1, v2, setV2, frequency, setFrequency, wavelength, setWavelength, beta, setBeta,
  z0, setZ0, minVoltage, maxVoltage
}) => {
  const [reflectionCoefficient, setReflectionCoefficient] = useState(0);

  useEffect(() => {
    // Update reflection coefficient when V1 or V2 changes
    const newReflectionCoefficient = v2 / v1;
    setReflectionCoefficient(newReflectionCoefficient);
  }, [v1, v2]);

  const handleInputChange = (setter, value) => {
    const numValue = Number(value);
    setter(numValue);
  };

  const handleSliderChange = (setter, value, min, max) => {
    const numValue = Number(value);
    setter(Math.min(Math.max(numValue, min), max));
  };

  const handleV1Change = (value) => {
    const newV1 = Number(value);
    setV1(newV1);
    checkV2NotGreaterThanV1(newV1, v2);
  };

  const handleV2Change = (value) => {
    const newV2 = Number(value);
    checkV2NotGreaterThanV1(v1, newV2);
  };

  const handleReflectionCoefficientChange = (value) => {
    const newReflectionCoefficient = Number(value);
    setReflectionCoefficient(newReflectionCoefficient);
    // Update V2 based on the new reflection coefficient
    const newV2 = v1 * newReflectionCoefficient;
    checkV2NotGreaterThanV1(v1, newV2);
  };

  const checkV2NotGreaterThanV1 = (newV1, newV2) => {
    if (Math.abs(newV2) > Math.abs(newV1)) {
      Swal.fire({
        title: 'Error!',
        text: 'The magnitude of V2 cannot be greater than the magnitude of V1.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } else {
      setV2(newV2);
    }
  };

  // Add this new function to handle wavelength changes
  const handleWavelengthChange = (value) => {
    const newWavelength = Number(value);
    setWavelength(newWavelength);
    // Update beta when wavelength changes
    setBeta(2 * Math.PI / newWavelength);
  };

  // Add this new function to handle beta changes
  const handleBetaChange = (value) => {
    const newBeta = Number(value);
    setBeta(newBeta);
    // Update wavelength when beta changes
    setWavelength(2 * Math.PI / newBeta);
  };

  return (
    <div className="control-panel">
      <div className="control">
        <label>V1 (V):</label>
        <input
          type="range"
          min={minVoltage}
          max={maxVoltage}
          step="0.1"
          value={v1}
          onChange={(e) => handleV1Change(e.target.value)}
        />
        <input
          type="number"
          value={v1}
          onChange={(e) => handleV1Change(e.target.value)}
          step="0.1"
        />
      </div>
      <div className="control">
        <label>V2 (V):</label>
        <input
          type="range"
          min={minVoltage}
          max={maxVoltage}
          step="0.1"
          value={v2}
          onChange={(e) => handleV2Change(e.target.value)}
        />
        <input
          type="number"
          value={v2}
          onChange={(e) => handleV2Change(e.target.value)}
          step="0.1"
        />
      </div>
      <div className="control">
        <label>Reflection Coefficient:</label>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.01"
          value={reflectionCoefficient}
          onChange={(e) => handleReflectionCoefficientChange(e.target.value)}
        />
        <input
          type="number"
          value={reflectionCoefficient.toFixed(2)}
          onChange={(e) => handleReflectionCoefficientChange(e.target.value)}
          step="0.01"
          min="-1"
          max="1"
        />
      </div>
      <div className="control">
        <label>Frequency (kHz):</label>
        <input
          type="range"
          min="0"
          max="1000"
          step="1"
          value={frequency}
          onChange={(e) => handleInputChange(setFrequency, e.target.value)}
        />
        <input
          type="number"
          value={frequency.toFixed(2)}
          onChange={(e) => handleInputChange(setFrequency, e.target.value)}
          step="0.01"
        />
      </div>
      <div className="control">
        <label>Wavelength (m):</label>
        <input
          type="range"
          min="1"
          max="200"
          step="1"
          value={wavelength}
          onChange={(e) => handleWavelengthChange(e.target.value)}
        />
        <input
          type="number"
          value={wavelength.toFixed(2)}
          onChange={(e) => handleWavelengthChange(e.target.value)}
          step="0.1"
        />
      </div>
      <div className="control">
        <label>Beta (rad/m):</label>
        <input
          type="range"
          min="0.01"
          max="6.28"
          step="0.01"
          value={beta}
          onChange={(e) => handleBetaChange(e.target.value)}
        />
        <input
          type="number"
          value={beta.toFixed(4)}
          onChange={(e) => handleBetaChange(e.target.value)}
          step="0.01"
        />
      </div>
      <div className="control">
        <label>Z0 (Ω):</label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={z0}
          onChange={(e) => handleInputChange(setZ0, e.target.value)}
        />
        <input
          type="number"
          value={z0}
          onChange={(e) => handleInputChange(setZ0, e.target.value)}
          step="0.1"
          min="0"
          max="10"
        />
      </div>
    </div>
  );
};

export default ControlPanel;
