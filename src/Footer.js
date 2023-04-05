import React from 'react';
import './Footer.css';
import logo from '192.png'

function Footer() {
  return (
    <footer className="footer bg-light">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
          <img src={logo} className="App-logo" alt="logo" />
          </div>
          <div className="col-md-4">
            <ul className="footer-links">
              <li><a href="#">Home</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <p>&copy; 2023 My Website</p>
            <p className="powered-by">Powered by Monsters NFT Inc.</p>
          </div>
        </div>
      </div>
    </footer>
  );
 
}

export default Footer;
