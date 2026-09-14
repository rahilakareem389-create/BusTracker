import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";  // ← Import API
import { Bus, User, Mail, Lock, Phone } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "", 
    email: "", 
    password: "", 
    phone: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // API call - backend se connect
      const { data } = await API.post("/auth/register", formData);
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("storage"));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950">
      <div className="max-w-md w-full bg-gray-900 rounded-2xl p-8 border border-gray-800">
        <div className="text-center mb-8">
          <Bus className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Full Name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full pl-10 pr-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg"
                required 
              />
            </div>
          </div>
          
          <div className="mb-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <input 
                type="email" 
                placeholder="Email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pl-10 pr-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg"
                required 
              />
            </div>
          </div>
          
          <div className="mb-4">
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <input 
                type="tel" 
                placeholder="Phone Number" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full pl-10 pr-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg"
                required 
              />
            </div>
          </div>
          
          <div className="mb-6">
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <input 
                type="password" 
                placeholder="Password (min 6 characters)" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-10 pr-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg"
                required 
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;