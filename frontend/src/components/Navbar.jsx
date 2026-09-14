import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Bus, Menu, X, LogOut, User } from "lucide-react";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user on mount and when localStorage changes
    const checkUser = () => {
      const userData = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (userData && token) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };
    
    checkUser();
    
    // Listen for storage changes (for multi-tab support)
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setMenuOpen(false);
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    return user.role === "admin" ? "/admin-dashboard" : "/dashboard";
  };

  const getDashboardText = () => {
    if (!user) return "Dashboard";
    return user.role === "admin" ? "Admin Panel" : "Dashboard";
  };

  return (
    <nav className="bg-black text-white shadow-md sticky top-0 z-50 border-b border-orange-500/30">
      <div className="flex items-center justify-between px-4 md:px-8 py-3">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Bus className="h-8 w-8 md:h-10 md:w-10 text-orange-500" />
          <span className="text-xl md:text-2xl font-bold text-white">BusTracker</span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-base font-medium">
          <Link to="/" className="hover:text-orange-500 transition">Home</Link>
          <Link to="/about" className="hover:text-orange-500 transition">About</Link>
          <Link to="/services" className="hover:text-orange-500 transition">Services</Link>
          <Link to="/book" className="hover:text-orange-500 transition">Book Tour</Link>
          <Link to={getDashboardLink()} className="hover:text-orange-500 transition">
            {getDashboardText()}
          </Link>
          <Link to="/customize" className="hover:text-orange-500 transition">Customize</Link>
          <Link to="/contact" className="hover:text-orange-500 transition">Contact</Link>
        </div>

        {/* DESKTOP RIGHT SIDE */}
        <div className="hidden lg:flex items-center gap-4">
          {/* SOCIAL ICONS */}
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noreferrer"
            className="text-orange-500 hover:text-yellow-400 text-lg transition"
          >
            <FaFacebookF />
          </a>
          <a 
            href="https://wa.me/923001234567" 
            target="_blank" 
            rel="noreferrer"
            className="text-orange-500 hover:text-yellow-400 text-lg transition"
          >
            <FaWhatsapp />
          </a>

          {/* User Section */}
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="text-sm text-gray-300 hidden xl:block">
                  {user.name?.split(' ')[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition text-sm"
              >
                <LogOut className="h-3 w-3" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-1.5 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="lg:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-orange-500">
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="lg:hidden flex flex-col gap-4 py-6 px-4 bg-black border-t border-gray-800">
          <Link onClick={() => setMenuOpen(false)} to="/" className="text-lg hover:text-orange-500 py-2">Home</Link>
          <Link onClick={() => setMenuOpen(false)} to="/about" className="text-lg hover:text-orange-500 py-2">About</Link>
          <Link onClick={() => setMenuOpen(false)} to="/services" className="text-lg hover:text-orange-500 py-2">Services</Link>
          <Link onClick={() => setMenuOpen(false)} to="/book" className="text-lg hover:text-orange-500 py-2">Book Tour</Link>
          <Link onClick={() => setMenuOpen(false)} to={getDashboardLink()} className="text-lg hover:text-orange-500 py-2">
            {getDashboardText()}
          </Link>
          <Link onClick={() => setMenuOpen(false)} to="/customize" className="text-lg hover:text-orange-500 py-2">Customize</Link>
          <Link onClick={() => setMenuOpen(false)} to="/contact" className="text-lg hover:text-orange-500 py-2">Contact</Link>

          {/* Social Icons Mobile */}
          <div className="flex gap-4 pt-2">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-orange-500 hover:text-yellow-400">
              <FaFacebookF className="h-5 w-5" />
            </a>
            <a href="https://wa.me/923001234567" target="_blank" rel="noreferrer" className="text-orange-500 hover:text-yellow-400">
              <FaWhatsapp className="h-5 w-5" />
            </a>
          </div>

          {/* User Section Mobile */}
          {user ? (
            <>
              <div className="flex items-center gap-2 pt-2">
                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="text-white">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}