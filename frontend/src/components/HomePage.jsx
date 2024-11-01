import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/HomePage.css';
import '../styles/Navbar.css';
import '../styles/Footer.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <Navbar />
      <div className="home-main-content">
        <header className="home-page-header">
          <h1 className="home-title">Transmission Line Wave Simulation</h1>
        </header>
        <section className="home-formula-section">
          <h2 className="home-subtitle">Key Formulas and Concepts</h2>
          
          <div className="home-formula-grid">
            <div className="home-formula-card">
              <h3 className="home-formula-title">Wave Components</h3>
              <p className="home-formula">Forward Wave: V<sub>f</sub>(z,t) = V<sub>1</sub> cos(ωt - βz)</p>
              <p className="home-formula">Backward Wave: V<sub>b</sub>(z,t) = V<sub>2</sub> cos(ωt + βz)</p>
              <p className="home-formula">Resultant Wave: V(z,t) = V<sub>f</sub>(z,t) + V<sub>b</sub>(z,t)</p>
            </div>

            <div className="home-formula-card">
              <h3 className="home-formula-title">Voltage and Current Waves</h3>
              <p className="home-formula">Voltage Wave: V(z,t) = V<sub>1</sub> cos(ωt - βz) + V<sub>2</sub> cos(ωt + βz)</p>
              <p className="home-formula">Current Wave: I(z,t) = (V<sub>1</sub>/Z<sub>0</sub>) cos(ωt - βz) - (V<sub>2</sub>/Z<sub>0</sub>) cos(ωt + βz)</p>
            </div>

            <div className="home-formula-card">
              <h3 className="home-formula-title">Wave Parameters</h3>
              <p className="home-formula">Angular Frequency: ω = 2πf</p>
              <p className="home-formula">Phase Constant: β = 2π/λ</p>
              <p className="home-formula">Wavelength: λ = 2π/β</p>
            </div>

            <div className="home-formula-card">
              <h3 className="home-formula-title">Transmission Line Characteristics</h3>
              <p className="home-formula">Reflection Coefficient: Γ = V<sub>2</sub> / V<sub>1</sub></p>
              <p className="home-formula">Voltage Standing Wave Ratio (VSWR): VSWR = (1 + |Γ|) / (1 - |Γ|)</p>
              <p className="home-formula">Characteristic Impedance: Z<sub>0</sub></p>
            </div>
          </div>

          <div className="home-symbol-definitions">
            <h3 className="home-symbol-title">Symbol Definitions</h3>
            <ul className="home-symbol-list">
              <li>V<sub>1</sub>: Amplitude of the forward voltage wave</li>
              <li>V<sub>2</sub>: Amplitude of the backward voltage wave</li>
              <li>ω: Angular frequency</li>
              <li>β: Phase constant</li>
              <li>z: Distance along the transmission line</li>
              <li>t: Time</li>
              <li>f: Frequency</li>
              <li>λ: Wavelength</li>
              <li>Z<sub>0</sub>: Characteristic impedance of the transmission line</li>
              <li>Γ: Reflection coefficient</li>
            </ul>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;