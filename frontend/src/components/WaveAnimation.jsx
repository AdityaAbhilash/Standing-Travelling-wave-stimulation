import React, { useRef, useEffect, useState } from 'react';

const WaveAnimation = ({ v1, v2, frequency, wavelength, beta, z0, showVoltage, time }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [showForward, setShowForward] = useState(true);
  const [showBackward, setShowBackward] = useState(true);
  const [showResultant, setShowResultant] = useState(true);
  const [metrics, setMetrics] = useState({ reflectionCoeff: 0, vswr: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    let startTime = null;

    const drawWave = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = (timestamp - startTime) / 150000; // Convert to seconds

      ctx.clearRect(0, 0, width, height);

      const w0 = 2 * Math.PI * frequency;
      const scale = height / 20; // Scale to fit ±10V in the canvas height

      // Draw grid lines and labels
      ctx.strokeStyle = '#ddd';
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      for (let v = -10; v <= 10; v += 2) {
        const y = height / 2 - v * scale;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
        ctx.fillText(`${v}${showVoltage ? 'V' : 'A'}`, 5, y - 5);
      }

      ctx.lineWidth = 3;

      // Calculate the number of wavelengths to show
      const numWavelengths = Math.max(1, Math.min(10, Math.floor(width / (wavelength * 50))));
      const totalLength = numWavelengths * wavelength;

      const drawWaveComponent = (amplitude, direction, color) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        for (let x = 0; x < width; x++) {
          const z = (x / width) * totalLength;
          let y;
          if (showVoltage) {
            y = height / 2 - amplitude * Math.cos(w0 * elapsedTime - direction * beta * z) * scale;
          } else {
            y = height / 2 - (amplitude / z0) * Math.cos(w0 * elapsedTime - direction * beta * z) * scale;
          }
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      };

      if (showForward) {
        drawWaveComponent(v1, 1, 'rgba(0, 0, 128, 1)'); // Dark blue
      }

      if (showBackward) {
        drawWaveComponent(v2, -1, 'rgba(128, 0, 0, 1)'); // Dark red
      }

      if (showResultant) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(75, 0, 130, 1)'; // Indigo
        for (let x = 0; x < width; x++) {
          const z = (x / width) * totalLength;
          let y;
          if (showVoltage) {
            y = height / 2 - (
              v1 * Math.cos(w0 * elapsedTime - beta * z) + 
              v2 * Math.cos(w0 * elapsedTime + beta * z)
            ) * scale;
          } else {
            y = height / 2 - (
              (v1 / z0) * Math.cos(w0 * elapsedTime - beta * z) - 
              (v2 / z0) * Math.cos(w0 * elapsedTime + beta * z)
            ) * scale;
          }
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Calculate VSWR and reflection coefficient
      const reflectionCoeff = (v2 / v1);
      const vswr = (1 + Math.abs(reflectionCoeff)) / (1 - Math.abs(reflectionCoeff));
      setMetrics({ reflectionCoeff, vswr });

      animationRef.current = requestAnimationFrame(drawWave);
    };

    animationRef.current = requestAnimationFrame(drawWave);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [v1, v2, frequency, wavelength, beta, z0, showVoltage, showForward, showBackward, showResultant]);

  return (
    <div className="wave-animation">
      <canvas ref={canvasRef} width={800} height={400} />
      <div className="wave-metrics">
        <p>Reflection Coefficient: {metrics.reflectionCoeff.toFixed(2)}</p>
        <p>VSWR: {metrics.vswr.toFixed(2)}</p>
      </div>
      <div className="wave-toggles">
        <label className="wave-toggle">
          <input
            type="checkbox"
            checked={showForward}
            onChange={() => setShowForward(!showForward)}
          />
          Forward Wave
        </label>
        <label className="wave-toggle">
          <input
            type="checkbox"
            checked={showBackward}
            onChange={() => setShowBackward(!showBackward)}
          />
          Backward Wave
        </label>
        <label className="wave-toggle">
          <input
            type="checkbox"
            checked={showResultant}
            onChange={() => setShowResultant(!showResultant)}
          />
          Resultant Wave
        </label>
      </div>
    </div>
  );
};

export default WaveAnimation;
