import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const ControlPanel = ({ 
  v1, setV1, v2, setV2, frequency, setFrequency, wavelength, setWavelength, beta, setBeta,
  z0, setZ0, minVoltage, maxVoltage
}) => {
  // Separate reflection coefficients for each mode
  const [directReflectionCoeff, setDirectReflectionCoeff] = useState(0);
  const [impedanceReflectionCoeff, setImpedanceReflectionCoeff] = useState(0);
  const [voltageReflectionCoeff, setVoltageReflectionCoeff] = useState(0);
  
  const [zL, setZL] = useState(z0);
  const [activeMode, setActiveMode] = useState('reflection');
  const [isUpdating, setIsUpdating] = useState(false);

  // Initialize default values
  useEffect(() => {
    setV1(3);
    setV2(3);
  }, []);

  // Handle impedance mode calculations
  useEffect(() => {
    if (isUpdating || activeMode !== 'impedance') return;
    setIsUpdating(true);
    
    if (z0 !== 0) {
      const newReflectionCoeff = (zL - z0) / (zL + z0);
      setImpedanceReflectionCoeff(newReflectionCoeff);
      
      // Update V2 based on impedance reflection coefficient
      const newV2 = v1 * newReflectionCoeff;
      if (Math.abs(newV2) <= Math.abs(v1)) {
        setV2(newV2);
      }
    }
    
    setIsUpdating(false);
  }, [z0, zL, activeMode]);

  // Handle voltage mode calculations
  useEffect(() => {
    if (isUpdating || activeMode !== 'voltage') return;
    setIsUpdating(true);
    
    if (v1 !== 0) {
      const newReflectionCoeff = v2 / v1;
      setVoltageReflectionCoeff(newReflectionCoeff);
    }
    
    setIsUpdating(false);
  }, [v1, v2, activeMode]);

  // Handlers for each mode
  const handleDirectReflectionChange = (value) => {
    const newReflectionCoeff = Number(value);
    if (newReflectionCoeff >= -1 && newReflectionCoeff <= 1) {
      setDirectReflectionCoeff(newReflectionCoeff);
      const newV2 = v1 * newReflectionCoeff;
      if (Math.abs(newV2) <= Math.abs(v1)) {
        setV2(newV2);
      }
    }
  };

  const handleZLChange = (value) => {
    const newZL = Number(value);
    if (newZL >= 0) {
      setZL(newZL);
    }
  };

  const handleZ0Change = (value) => {
    const newZ0 = Number(value);
    if (newZ0 > 0) {
      setZ0(newZ0);
    }
  };

  const handleV1Change = (value) => {
    const newV1 = Number(value);
    setV1(newV1);
  };

  const handleV2Change = (value) => {
    const newV2 = Number(value);
    if (Math.abs(newV2) <= Math.abs(v1)) {
      setV2(newV2);
    }
  };

  // Handle wavelength changes
  const handleWavelengthChange = (value) => {
    const newWavelength = Number(value);
    if (newWavelength > 0) {
      setWavelength(newWavelength);
      // Update beta according to β = 2π/λ
      const newBeta = (2 * Math.PI / newWavelength);
      setBeta(Number(newBeta.toFixed(2)));
    }
  };

  // Handle beta changes
  const handleBetaChange = (value) => {
    const newBeta = Number(value);
    if (newBeta > 0) {
      setBeta(newBeta);
      // Update wavelength according to λ = 2π/β
      const newWavelength = (2 * Math.PI / newBeta);
      setWavelength(Number(newWavelength.toFixed(2)));
    }
  };

  return (
    <div className="control-panel">
      <div className="control-panel-header">
        <h3>Wave Parameters</h3>
        <div className="wave-parameters-controls">
          <div className="control">
            <label>Frequency (Hz):</label>
            <div className="input-group">
              <input
                type="range"
                min="1"
                max="1000"
                step="1"
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
              />
              <input
                type="number"
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                min="1"
                max="1000"
              />
            </div>
          </div>

          <div className="control">
            <label>Wavelength (m):</label>
            <div className="input-group">
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={wavelength}
                onChange={(e) => handleWavelengthChange(e.target.value)}
              />
              <input
                type="number"
                value={Number(wavelength).toFixed(2)}
                onChange={(e) => handleWavelengthChange(e.target.value)}
              />
            </div>
          </div>

          <div className="control">
            <label>Beta (rad/m):</label>
            <div className="input-group">
              <input
                type="range"
                min="0.5"
                max="6.28"
                step="0.1"
                value={beta}
                onChange={(e) => handleBetaChange(e.target.value)}
              />
              <input
                type="number"
                value={Number(beta).toFixed(2)}
                onChange={(e) => handleBetaChange(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="control-panel-content">
        <div className="mode-selector">
          <button 
            className={`mode-btn ${activeMode === 'reflection' ? 'active' : ''}`}
            onClick={() => setActiveMode('reflection')}
          >
            Direct Reflection Coefficient
          </button>
          <button 
            className={`mode-btn ${activeMode === 'impedance' ? 'active' : ''}`}
            onClick={() => setActiveMode('impedance')}
          >
            Impedance Based
          </button>
          <button 
            className={`mode-btn ${activeMode === 'voltage' ? 'active' : ''}`}
            onClick={() => setActiveMode('voltage')}
          >
            Voltage Based
          </button>
        </div>

        {activeMode === 'reflection' && (
          <div className="control-section">
            <div className="control">
              <label>Direct Reflection Coefficient:</label>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.01"
                value={directReflectionCoeff}
                onChange={(e) => handleDirectReflectionChange(e.target.value)}
              />
              <input
                type="number"
                value={directReflectionCoeff.toFixed(2)}
                onChange={(e) => handleDirectReflectionChange(e.target.value)}
                step="0.01"
                min="-1"
                max="1"
              />
            </div>
          </div>
        )}

        {activeMode === 'impedance' && (
          <div className="control-section">
            <div className="control">
              <label>Z0 (Ω):</label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={z0}
                onChange={(e) => handleZ0Change(e.target.value)}
              />
              <input
                type="number"
                value={z0.toFixed(2)}
                onChange={(e) => handleZ0Change(e.target.value)}
                step="0.1"
              />
            </div>
            <div className="control">
              <label>Load Impedance ZL (Ω):</label>
              <input
                type="range"
                min="0.0"
                max="20"
                step="0.1"
                value={zL}
                onChange={(e) => handleZLChange(e.target.value)}
              />
              <input
                type="number"
                value={zL.toFixed(2)}
                onChange={(e) => handleZLChange(e.target.value)}
                step="0.1"
              />
            </div>
          </div>
        )}

        {activeMode === 'voltage' && (
          <div className="control-section">
            <div className="control">
              <label>V1 (V):</label>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.1"
                value={v1}
                onChange={(e) => handleV1Change(e.target.value)}
              />
              <input
                type="number"
                value={v1.toFixed(2)}
                onChange={(e) => handleV1Change(e.target.value)}
                step="0.1"
              />
            </div>
            <div className="control">
              <label>V2 (V):</label>
              <input
                type="range"
                min={-Math.abs(v1)}
                max={Math.abs(v1)}
                step="0.1"
                value={v2}
                onChange={(e) => handleV2Change(e.target.value)}
              />
              <input
                type="number"
                value={v2.toFixed(2)}
                onChange={(e) => handleV2Change(e.target.value)}
                step="0.1"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
