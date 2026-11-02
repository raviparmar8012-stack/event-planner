
import { Link } from "react-router-dom";
import "../styles/footer.css";

function Footer() {
    return (
        <footer className="eh-footer">
            <div className="eh-footer-container">
                <div className="eh-footer-main">
                    <div className="eh-footer-brand">
                        <Link to="/" className="eh-footer-logo">
                            <span className="eh-footer-logo-icon">E</span>
                            Event<span>Hub</span>
                        </Link>

                        <p>
                            Making every celebration memorable.
                            Discover trusted vendors, beautiful venues
                            and event packages in one place.
                        </p>

                        <div className="eh-social-links">
                            <a href="https://www.instagram.com/" target="_blank"
                               rel="noreferrer" aria-label="Instagram">IG</a>
                            <a href="https://www.facebook.com/" target="_blank"
                               rel="noreferrer" aria-label="Facebook">FB</a>
                            <a href="https://www.linkedin.com/" target="_blank"
                               rel="noreferrer" aria-label="LinkedIn">IN</a>
                        </div>
                    </div>

                    <div className="eh-footer-column">
                        <h3>Quick Links</h3>
                        <Link to="/">Home</Link>
                        <Link to="/about">About Us</Link>
                        <Link to="/vendor">Our Vendors</Link>
                        <Link to="/packages">Packages</Link>
                        <Link to="/contact">Contact Us</Link>
                    </div>

                    <div className="eh-footer-column">
                        <h3>Our Services</h3>
                        <a href="/#services">Wedding Events</a>
                        <a href="/#services">Birthday Parties</a>
                        <a href="/#services">Corporate Events</a>
                        <a href="/#services">Venue Selection</a>
                        <a href="/#services">Event Decoration</a>
                    </div>

                    <div className="eh-footer-column eh-footer-contact">
                        <h3>Get in Touch</h3>
                        <p><span>✉</span> contact@eventhub.com</p>
                        <p><span>⌖</span> Junagadh, Gujarat, India</p>
                        <Link to="/booking" className="eh-footer-cta">
                            Plan Your Event ↗
                        </Link>
                    </div>
                </div>

                <div className="eh-footer-bottom">
                    <p>
                        © {new Date().getFullYear()} Event Hub.
                        All rights reserved.
                    </p>

                    <p>Made with care for your special moments ♡</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
