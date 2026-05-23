import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState(''); // '', 'success', 'error'

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setSubscribeStatus('error');
      return;
    }
    // Store in localStorage as a simple persistence
    const existing = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
    if (existing.includes(email)) {
      setSubscribeStatus('already');
      return;
    }
    existing.push(email);
    localStorage.setItem('newsletter_subscribers', JSON.stringify(existing));
    setSubscribeStatus('success');
    setEmail('');
    setTimeout(() => setSubscribeStatus(''), 4000);
  };

  return (
    <footer className="main-footer">
      <div className="footer-top container">
        {/* Company Info */}
        <div className="footer-col brand-col">
          <Link to="/" className="footer-logo">
            <span className="logo-dot"></span>
            LuxeBook
          </Link>
          <p className="footer-description">
            Your premium destination for booking elite home and professional local services. High quality, verified experts, instant booking.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-icon" aria-label="Facebook">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/></svg>
            </a>
            <a href="#" className="social-icon" aria-label="Twitter">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>
        </div>

        {/* Services Links */}
        <div className="footer-col">
          <h3>Popular Services</h3>
          <ul>
            <li><Link to="/services?category=cleaning">Premium Cleaning</Link></li>
            <li><Link to="/services?category=handyman">Elite Handyman</Link></li>
            <li><Link to="/services?category=wellness">Beauty & Wellness</Link></li>
            <li><Link to="/services?category=moving">Smooth Relocation</Link></li>
            <li><Link to="/services?category=tech">Smart Home Tech</Link></li>
          </ul>
        </div>

        {/* Quick Navigation Links */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home Portal</Link></li>
            <li><Link to="/services">All Services</Link></li>
            <li><a href="#about">Our Story</a></li>
            <li><a href="#faq">FAQ Help</a></li>
            <li><a href="#contact">Support Desk</a></li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div className="footer-col newsletter-col">
          <h3>Stay Updated</h3>
          <p>Subscribe to our newsletter for exclusive offers and premium service releases.</p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Your email address" 
              className="newsletter-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <button type="submit" className="btn btn-accent btn-sm subscribe-btn">
              Subscribe
            </button>
          </form>
          {subscribeStatus === 'success' && (
            <p style={{ color: '#4ade80', fontSize: '0.85rem', marginTop: '8px' }}>✓ Subscribed successfully!</p>
          )}
          {subscribeStatus === 'already' && (
            <p style={{ color: '#facc15', fontSize: '0.85rem', marginTop: '8px' }}>You're already subscribed!</p>
          )}
          {subscribeStatus === 'error' && (
            <p style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '8px' }}>Please enter a valid email.</p>
          )}
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-container container">
          <p>&copy; {currentYear} LuxeBook. Designed with excellence. All rights reserved.</p>
          <div className="footer-legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Trust & Safety</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
