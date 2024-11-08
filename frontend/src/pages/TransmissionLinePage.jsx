import React, { useState, useEffect, useRef } from 'react';
import WaveAnimation from '../components/WaveAnimation';
import ControlPanel from '../components/ControlPanel';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/TransmissionLine.css';

const TransmissionLinePage = () => {
  const [v1, setV1] = useState(1);
  // const [v2, setV2] = useState(0);
  const [frequency, setFrequency] = useState(300);
  const [wavelength, setWavelength] = useState(5);
  const [beta, setBeta] = useState(2 * Math.PI / 100);
  const [z0, setZ0] = useState(5);
  const [showVoltage, setShowVoltage] = useState(true);
  const [minVoltage, setMinVoltage] = useState(-5);
  const [maxVoltage, setMaxVoltage] = useState(5);
  const [alpha, setAlpha] = useState(0);
  const [storedReflectionCoeff, setStoredReflectionCoeff] = useState(0);
  const [time, setTime] = useState(0);
  const animationRef = useRef();

  const numWavelengths = Math.max(1, Math.min(10, Math.floor(800 / (wavelength * 50))));
  const maxWidth = numWavelengths * wavelength;

  useEffect(() => {
    const animate = () => {
      setTime((prevTime) => prevTime + 0.016);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    setBeta(2 * Math.PI / wavelength);
  }, [wavelength]);

  // useEffect(() => {
  //   const newV2 = v1 * Math.exp(-2 * alpha * maxWidth);
  //   setV2(newV2);
  // }, [v1, alpha, maxWidth]);

  const handleWavelengthChange = (newWavelength) => {
    setWavelength(newWavelength);
    setBeta(2 * Math.PI / newWavelength);
  };

  return (
    <>
      <Navbar />
      <div className="transmission-line-page">
        <h1>Transmission Line Wave Simulation</h1>
        <div className="main-content">
          <div className="wave-section">
            <div className="wave-type-toggle">
              <input
                type="radio"
                id="voltage-wave"
                name="wave-type"
                value="voltage"
                checked={showVoltage}
                onChange={() => setShowVoltage(true)}
              />
              <label htmlFor="voltage-wave">Voltage Wave</label>
              <input
                type="radio"
                id="current-wave"
                name="wave-type"
                value="current"
                checked={!showVoltage}
                onChange={() => setShowVoltage(false)}
              />
              <label htmlFor="current-wave">Current Wave</label>
            </div>
            <div className="wave-container">
              <WaveAnimation
                v1={v1}
                // v2={v2}
                frequency={frequency}
                wavelength={wavelength}
                beta={beta}
                z0={z0}
                alpha={alpha}
                showVoltage={showVoltage}
                time={time}
                minVoltage={minVoltage}
                maxVoltage={maxVoltage}
                maxWidth={maxWidth}
                storedReflectionCoeff={storedReflectionCoeff}
              />
            </div>
          </div>
          <ControlPanel
            v1={v1}
            setV1={setV1}
            frequency={frequency}
            setFrequency={setFrequency}
            wavelength={wavelength}
            setWavelength={handleWavelengthChange}
            beta={beta}
            setBeta={setBeta}
            z0={z0}
            setZ0={setZ0}
            minVoltage={minVoltage}
            maxVoltage={maxVoltage}
            setMinVoltage={setMinVoltage}
            setMaxVoltage={setMaxVoltage}
            alpha={alpha}
            setAlpha={setAlpha}
            maxWidth={maxWidth}
            setStoredReflectionCoeff={setStoredReflectionCoeff}
            // v2={v2}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TransmissionLinePage;
