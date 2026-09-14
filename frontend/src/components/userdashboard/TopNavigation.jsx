import { Bus, LogOut, User, Menu, X } from "lucide-react";
import { useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";

const TopNavigation = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="bg-black border-b border-orange-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <Bus className="h-8 w-8 text-orange-500" />
            <span className="ml-2 text-xl font-bold text-white">BusTracker</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/" className={({ isActive }) => 
              `px-3 py-2 rounded-lg text-sm font-medium transition ${isActive ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'}`
            }>
              Home
            </NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => 
              `px-3 py-2 rounded-lg text-sm font-medium transition ${isActive ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'}`
            }>
              Dashboard
            </NavLink>
            <NavLink to="/book" className={({ isActive }) => 
              `px-3 py-2 rounded-lg text-sm font-medium transition ${isActive ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'}`
            }>
              Book Tour
            </NavLink>
            
            <div className="flex items-center gap-3 ml-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="text-gray-300 text-sm">{user?.name}</span>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
              {isMobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800 p-4">
          <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-gray-400 hover:text-orange-500">
            Home
          </NavLink>
          <NavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-gray-400 hover:text-orange-500">
            Dashboard
          </NavLink>
          <NavLink to="/book" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-gray-400 hover:text-orange-500">
            Book Tour
          </NavLink>
          <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-red-500">
            <LogOut className="h-4 w-4 inline mr-2" /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default TopNavigation;