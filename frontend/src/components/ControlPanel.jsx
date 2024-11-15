import React, { useState, useEffect, useRef } from 'react';
import { create, all } from 'mathjs';

const math = create(all);

const ControlPanel = ({ 
  v1, setV1, frequency, setFrequency, wavelength, setWavelength, beta, setBeta,
  z0, setZ0, minVoltage, maxVoltage, alpha, setAlpha, maxWidth, setStoredReflectionCoeff,
  realZ0, setRealZ0, imaginaryZ0, setImaginaryZ0
}) => {
  const [realZL, setRealZL] = useState(0);
  const [imaginaryZL, setImaginaryZL] = useState(0);
  const zL = useRef(math.complex(5, 0)); // Default value for ZL
  const [reflectionCoeff, setReflectionCoeff] = useState(0); // Add state for reflection coefficient

  useEffect(() => {
    const complexZ0 = math.complex(realZ0, imaginaryZ0);
    if (!math.equal(complexZ0, z0)) {
      setZ0(complexZ0); // Set Z0 as a complex number only if it has changed
      calculateReflectionCoefficient(complexZ0, zL.current); // Calculate reflection coefficient
    }
  }, [realZ0, imaginaryZ0]);

  useEffect(() => {
    const complexZL = math.complex(realZL, imaginaryZL);
    if (!math.equal(complexZL, zL.current)) {
      zL.current = complexZL; // Update the ref for ZL
      calculateReflectionCoefficient(z0, complexZL); // Calculate reflection coefficient
    }
  }, [realZL, imaginaryZL, z0]);

  const calculateReflectionCoefficient = (z0, zL) => {
    const reflectionCoeff = math.divide(math.subtract(zL, z0), math.add(zL, z0));
    setStoredReflectionCoeff(reflectionCoeff);
    setReflectionCoeff(math.abs(reflectionCoeff));
    console.log("Reflection Coefficient:", reflectionCoeff.toString());
  };

  const handleV1Change = (value) => {
    setV1(Number(value)); // Update the state for v1
  };

  const handleWavelengthChange = (value) => {
    const newWavelength = Number(value);
    setWavelength(newWavelength);
    setBeta(2 * Math.PI / newWavelength); // Update beta based on new wavelength
  };

  const handleBetaChange = (value) => {
    const newBeta = Number(value);
    setBeta(newBeta);
    const newWavelength = (2 * Math.PI) / newBeta; // Calculate new wavelength based on beta
    setWavelength(newWavelength); // Update wavelength
  };

  // Calculate v2 based on the reflection coefficient and v1
  // const absreflectionCoeff = math.abs(setStoredReflectionCoeff);
  // const v2 = absreflectionCoeff * v1 * Math.exp(-2 * alpha * maxWidth); // Example calculation for v2
  const v2 = reflectionCoeff * v1 * Math.exp(-2 * alpha * maxWidth); // Example calculation for v2

  return (
    <div className="control-panel">
      <div className="control-panel-header">
        <h3>Wave Parameters</h3>
        <div className="wave-parameters-controls">
          <div className="control">
            <label>Frequency (MHz):</label>
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
                onChange={(e) => handleBetaChange(e.target.value)} // Update beta and wavelength
              />
              <input
                type="number"
                value={beta.toFixed(2)}
                onChange={(e) => handleBetaChange(e.target.value)} // Update beta and wavelength
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="control">
            <label>Attenuation Constant α (Np/m):</label>
            <div className="input-group">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={alpha}
                onChange={(e) => setAlpha(Number(e.target.value))}
              />
              <input
                type="number"
                value={Number(alpha).toFixed(2)}
                onChange={(e) => setAlpha(Number(e.target.value))}
                min="0"
                max="1"
                step="0.01"
              />
            </div>
          </div>

          <div className="control">
            <label>V1 (V):</label>
            <div className="input-group">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={v1}
                onChange={(e) => handleV1Change(e.target.value)}
              />
              <input
                type="number"
                value={v1}
                onChange={(e) => handleV1Change(e.target.value)}
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="control">
            <label>Z0 (Ohms):</label>
            <div className="input-group">
              <input
                type="number"
                value={realZ0}
                onChange={(e) => setRealZ0(Number(e.target.value))}
                placeholder="Real part"
              />
              <input
                type="number"
                value={imaginaryZ0}
                onChange={(e) => setImaginaryZ0(Number(e.target.value))}
                placeholder="Imaginary part"
              />
            </div>
          </div>

          <div className="control">
            <label>ZL (Ohms):</label>
            <div className="input-group">
              <input
                type="number"
                value={realZL}
                onChange={(e) => setRealZL(Number(e.target.value))}
                placeholder="Real part"
              />
              <input
                type="number"
                value={imaginaryZL}
                onChange={(e) => setImaginaryZL(Number(e.target.value))}
                placeholder="Imaginary part"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="v2-value">
        <h4 className="v2-text">Calculated V2: {v2.toFixed(2)}</h4>
      </div>
    </div>
  );
};

export default ControlPanel;
