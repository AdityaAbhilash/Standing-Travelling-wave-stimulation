import React, { useRef, useEffect, useState } from 'react';
import { create, all } from 'mathjs';

const math = create(all);

const WaveAnimation = ({ v1, frequency, wavelength, beta, z0,realZ0,imaginaryZ0,alpha, showVoltage, time, maxWidth, storedReflectionCoeff }) => {
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
      const elapsedTime = (timestamp - startTime) / 40000; // Convert to seconds

      ctx.clearRect(0, 0, width, height); // Clear the canvas

      const w0 = 2 * Math.PI * frequency; // Update w0 based on frequency
      const voltageMax = Math.max(v1, 10); // Ensure voltageMax is set correctly
      const scale = height / (2 * 100); // Scale to fit ±100V in the canvas height

      // Draw grid lines and labels dynamically based on voltage levels
      ctx.strokeStyle = '#ddd';
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      if (showVoltage) { // Check if we should show voltage
        for (let v = -100; v <= 100; v += 10) { // Adjust the range and step for labels
          const y = height / 2 - v * scale;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
          ctx.fillText(`${v} V`, 5, y - 5); // Ensure labels are drawn
        }
      } else { // Show current in amperes
        for (let a = -100; a <= 100; a += 10) { // Adjust the range and step for current labels
          const y = height / 2 - a * scale; // Adjust scale for current
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
          ctx.fillText(`${a} A`, 5, y - 5); // Ensure labels are drawn
        }
      }

      ctx.lineWidth = 3;

      // Calculate the number of wavelengths to show
      const numWavelengths = Math.max(1, Math.min(10, Math.floor(width / (wavelength * 50))));
      const totalLength = numWavelengths * wavelength;
      const gamma = math.complex(alpha, (2 * Math.PI) / wavelength);
      const reflectionCoeff = storedReflectionCoeff; // Use the stored reflection coefficient
      const absReflectionCoeff = math.abs(reflectionCoeff); // Get the absolute value (magnitude)
      const angleReflectionCoeff = math.arg(reflectionCoeff); // Get the angle (in radians)
      const z1 = math.complex(realZ0, imaginaryZ0);
      // const magi = Math.sqrt(realZ0*realZ0 + imaginaryZ0*imaginaryZ0);
      const arg = math.arg(z1);
      const magi = math.abs(z1);
      
      const v2 = absReflectionCoeff * v1 * Math.exp(-2 * alpha * maxWidth);
      
      if(showVoltage){
      const drawWaveComponent = (amplitude, direction, color) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        for (let x = 0; x < width; x++) {
          const z = (x / width) * totalLength; // Calculate z based on x
          let y;
          y = height / 2 - amplitude * Math.exp(direction === 1 ? -alpha * z : alpha * z) * Math.cos(w0 * elapsedTime - direction * beta * z) * scale;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      if (showForward) {
        drawWaveComponent(v1, 1, 'rgba(0, 0, 128, 1)'); // Dark blue
      }

      if (showBackward) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(128, 0, 0, 1)'; // Dark red for backward wave
        for (let x = 0; x < width; x++) {
          const z = (x / width) * totalLength; // Calculate z based on x
          let y = height / 2 - (
            v2 * Math.exp(alpha * z)  * Math.cos(w0 * elapsedTime + beta * z + angleReflectionCoeff - beta*maxWidth) // Calculate y for backward wave
          ) * scale; // Scale the y value
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      if (showResultant) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(75, 0, 130, 1)'; // Indigo for resultant wave
        for (let x = 0; x < width; x++) {
          const z = (x / width) * totalLength; // Calculate z based on x
          
          // Calculate y for forward wave
          const forwardY = (
            -v1 * Math.exp(-alpha * z) * Math.cos(w0 * elapsedTime - beta * z) // Forward wave calculation
          ) * scale;

          // Calculate y for backward wave
          const backwardY = height / 2 - (
            -v2 * Math.exp(alpha * z)  * Math.cos(w0 * elapsedTime + beta * z + angleReflectionCoeff - beta*maxWidth) // Backward wave calculation
          ) * scale;

          // Calculate resultant y by adding forward and backward waves
          const resultantY = forwardY + backwardY;

          if (x === 0) {
            ctx.moveTo(x, resultantY);
          } else {
            ctx.lineTo(x, resultantY);
          }
        }
        ctx.stroke();
      }

    }



    else{
      const drawWaveComponent = (amplitude, direction, color) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        for (let x = 0; x < width; x++) {
          const z = (x / width) * totalLength; // Calculate z based on x
          let y;
          // Divide amplitude by the absolute magnitude of z0
          y = height / 2 - (amplitude/magi) * Math.exp(direction === 1 ? -alpha * z : alpha * z) * Math.cos(w0 * elapsedTime - direction * beta * z - arg) * scale;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      if (showForward) {
        drawWaveComponent(v1, 1, 'rgba(0, 0, 128, 1)'); // Dark blue
      }

      if (showBackward) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(128, 0, 0, 1)'; // Dark red for backward wave
        for (let x = 0; x < width; x++) {
          const z = (x / width) * totalLength; // Calculate z based on x
          let y = height / 2 - (
            (v2/magi) * Math.exp(alpha * z)  * Math.cos(w0 * elapsedTime + beta * z + angleReflectionCoeff - beta*maxWidth -arg) // Calculate y for backward wave
          ) * scale; // Scale the y value
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      if (showResultant) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(75, 0, 130, 1)'; // Indigo for resultant wave
        for (let x = 0; x < width; x++) {
          const z = (x / width) * totalLength; // Calculate z based on x
          
          // Calculate y for forward wave
          const forwardY = height - (
            (v1/magi) * Math.exp(-alpha * z) * Math.cos(w0 * elapsedTime - beta * z -arg) // Forward wave calculation
          ) * scale;

          // Calculate y for backward wave
          const backwardY = height / 2 - (
            (v2/magi) * Math.exp(alpha * z)  * Math.cos(w0 * elapsedTime + beta * z + angleReflectionCoeff - beta*maxWidth -arg) // Backward wave calculation
          ) * scale;

          // Calculate resultant y by adding forward and backward waves
          const resultantY = forwardY - backwardY;

          if (x === 0) {
            ctx.moveTo(x, resultantY);
          } else {
            ctx.lineTo(x, resultantY);
          }
        }
        ctx.stroke();
      }

    }



      // Calculate VSWR and reflection coefficient using the stored reflection coefficient
      const vswr = (1 + math.abs(reflectionCoeff)) / (1 - math.abs(reflectionCoeff));
      setMetrics({ reflectionCoeff, vswr });

      animationRef.current = requestAnimationFrame(drawWave);
    };

    animationRef.current = requestAnimationFrame(drawWave);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [v1, frequency, wavelength, beta, z0, alpha, showVoltage, showForward, showBackward, showResultant, maxWidth, storedReflectionCoeff]);

  return (
    <div className="wave-animation">
      <canvas ref={canvasRef} width={800} height={400} />
      <div className="wave-metrics">
        <p>Reflection Coefficient: {storedReflectionCoeff.toString()}</p>
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
