import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { Bus, Mail, Lock } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const { data } = await API.post("/auth/login", { email, password });
      
      // Store in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("storage"));
      
      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <Bus className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-gray-400 text-sm mt-2">Login to your account</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email" 
                className="w-full pl-10 pr-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                required 
              />
            </div>
          </div>
          
          <div className="mb-6">
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
                className="w-full pl-10 pr-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                required 
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <p className="text-center text-gray-400 text-sm mt-4">
          Don't have an account?{' '}
          <button onClick={() => navigate("/register")} className="text-orange-500 hover:underline">
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;