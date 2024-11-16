import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer-title">&copy; 2023 Wave Simulator. All rights reserved.</p>
      <div className="footer-developers">
        <p className="footer-developers-title">Developed by:</p>
        <div className="developer-names">
          <p className="developer-name">ADITYA ABHILASH</p>
          <p className="developer-name">C S AJAY PRAKAASH</p>
          <p className="developer-name">AMBATI SETHU RAMAN</p>
        </div>
        <p className="footer-affiliation">Affiliation: IIT Bhubaneswar</p>
      </div>
    </footer>
  );
};

export default Footer;
