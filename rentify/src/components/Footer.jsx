import React from 'react';
import '../Styles/Footer.css';

const Footer = () => {
  return (
    <div className='footer'>
    <footer>
      <div className="footer-content">
        <div className="footer-section about">
          <h2>About Us</h2>
          <p>We are a company dedicated to providing the best services to our customers. Our mission is to deliver high-quality products that meet the needs of our clients.</p>
        </div>
        <div className="footer-section links">
          <h2>Quick Links</h2>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/package">Buyer</a></li>
            <li><a href="/about">Seller</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section contact">
          <h2>Contact Us</h2>
          <p>Email: renteasy@gmail.com</p>
          <p>Phone: +123 456 7890</p>
          <div className="socials">
            <a href="/"><i className="fab fa-facebook-f"></i></a>
            <a href="/"><i className="fab fa-twitter"></i></a>
            <a href="/"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
        <div className="footer-section support">
          <h2>Help & Support</h2>
          <ul>
            <li><a href="/">FAQs</a></li>
            <li><a href="/">Customer Support</a></li>
            <li><a href="/">Contact Form</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; 2024 Company. All Rights Reserved.
      </div>
    </footer>
    </div>
  );
};

export default Footer;
