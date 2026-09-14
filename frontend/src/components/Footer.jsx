import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-12 border-t border-gray-800">

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-xl font-bold text-orange-400">
                Travel Agency
              </h2>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted travel booking platform built for fast,
              easy and secure journey management.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-lg font-semibold text-orange-400 mb-3">
              Quick Links
            </h3>

            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-yellow-400">Home</Link></li>
              <li><Link to="/about" className="hover:text-yellow-400">About</Link></li>
              <li><Link to="/services" className="hover:text-yellow-400">Services</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-400">Contact</Link></li>
            </ul>
          </div>

          {/* SERVICES */}
          <div>
            <h3 className="text-lg font-semibold text-orange-400 mb-3">
              Services
            </h3>

            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/book" className="hover:text-yellow-400">Book Ticket</Link></li>
              <li><Link to="/customize" className="hover:text-yellow-400">Customize Ride</Link></li>
              <li><Link to="/dashboard" className="hover:text-yellow-400">Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-yellow-400">Login</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-lg font-semibold text-orange-400 mb-3">
              Contact
            </h3>

            <p className="text-gray-400 text-sm mb-2">
              Email: info@travelagency.com
            </p>
            <p className="text-gray-400 text-sm mb-2">
              Phone: +92 300 12345678
            </p>
            <p className="text-gray-400 text-sm">
              Mon - Fri: 9AM - 6PM
            </p>
          </div>

          {/* SOCIAL LINKS (NEW SECTION) */}
          <div>
            <h3 className="text-lg font-semibold text-orange-400 mb-3">
              Follow Us
            </h3>

            <div className="flex gap-4 text-gray-400 text-lg">
              
              <a href="https://facebook.com" target="_blank" rel="noreferrer"
                 className="hover:text-blue-500 transition">
                <FaFacebookF />
              </a>

              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                 className="hover:text-pink-500 transition">
                <FaInstagram />
              </a>

              <a href="https://linkedin.com" target="_blank" rel="noreferrer"
                 className="hover:text-blue-400 transition">
                <FaLinkedinIn />
              </a>

              <a href="https://twitter.com" target="_blank" rel="noreferrer"
                 className="hover:text-sky-400 transition">
                <FaTwitter />
              </a>

            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-yellow-500 text-sm">
          © 2026 Travel Agency. All rights reserved.
        </div>

      </div>
    </footer>
  );
}