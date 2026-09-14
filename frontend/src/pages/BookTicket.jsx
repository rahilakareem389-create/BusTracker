import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import { Bus, MapPin, Clock, Users, CreditCard, User, Phone, Mail, IdCard } from "lucide-react";

const BookTicket = () => {
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "", cnic: "", phone: "", email: "", seats: 1,
    paymentMethod: "jazzcash", transactionId: ""
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchTours();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setFormData(prev => ({
      ...prev,
      fullName: user.name || "",
      email: user.email || "",
      phone: user.phone || ""
    }));
    
    if (location.state?.tour) {
      setSelectedTour(location.state.tour);
    }
  }, []);

  const fetchTours = async () => {
    try {
      const { data } = await API.get("/tours");
      setTours(data.tours || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedTour) {
      alert("Please select a tour first");
      return;
    }
    
    setBooking(true);
    try {
      const { data } = await API.post("/bookings", {
        tourId: selectedTour._id,
        ...formData
      });
      
      alert(`✅ Booking successful! Booking ID: ${data.booking.bookingId}\nStatus: Pending Admin Approval`);
      navigate("/dashboard");
    } catch (error) {
      alert("Booking failed: " + (error.response?.data?.message || error.message));
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Book Your Tour</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Tours List */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Select Tour</h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {tours.map((tour) => (
                <div
                  key={tour._id}
                  onClick={() => setSelectedTour(tour)}
                  className={`p-4 rounded-lg cursor-pointer transition border ${
                    selectedTour?._id === tour._id
                      ? "bg-orange-500/20 border-orange-500"
                      : "bg-gray-800 border-gray-700 hover:border-orange-500/50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-semibold">{tour.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{tour.from} → {tour.to}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <Clock className="h-3 w-3" />
                        <span>{tour.time} • {tour.duration}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-orange-500 font-bold text-lg">₨ {tour.price}</p>
                      <p className="text-gray-500 text-xs">{tour.seats} seats left</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Booking Details</h2>
            
            {selectedTour ? (
              <form onSubmit={handleBooking} className="space-y-4">
                <div className="bg-orange-500/10 p-4 rounded-lg mb-4">
                  <p className="text-orange-500 font-bold">Selected Tour: {selectedTour.name}</p>
                  <p className="text-gray-400 text-sm">Price: ₨ {selectedTour.price} per person</p>
                </div>
                
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-500 h-4 w-4" />
                  <input type="text" placeholder="Full Name" value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg" required />
                </div>
                
                <div className="relative">
                  <IdCard className="absolute left-3 top-3 text-gray-500 h-4 w-4" />
                  <input type="text" placeholder="CNIC (12345-1234567-1)" value={formData.cnic}
                    onChange={(e) => setFormData({...formData, cnic: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg" required />
                </div>
                
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-500 h-4 w-4" />
                  <input type="tel" placeholder="Phone Number" value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg" required />
                </div>
                
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-500 h-4 w-4" />
                  <input type="email" placeholder="Email" value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg" required />
                </div>
                
                <div className="relative">
                  <Users className="absolute left-3 top-3 text-gray-500 h-4 w-4" />
                  <input type="number" min="1" max="10" placeholder="Number of Seats" value={formData.seats}
                    onChange={(e) => setFormData({...formData, seats: parseInt(e.target.value)})}
                    className="w-full pl-10 pr-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg" required />
                </div>
                
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 text-gray-500 h-4 w-4" />
                  <select value={formData.paymentMethod}
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg">
                    <option value="jazzcash">JazzCash</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="cash">Cash on Board</option>
                  </select>
                </div>
                
                <div className="relative">
                  <input type="text" placeholder="Transaction ID (for JazzCash/Bank)" value={formData.transactionId}
                    onChange={(e) => setFormData({...formData, transactionId: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg" />
                </div>
                
                <div className="bg-yellow-500/10 p-3 rounded-lg">
                  <p className="text-yellow-500 text-sm">Total Amount: <strong>₨ {selectedTour.price * formData.seats}</strong></p>
                </div>
                
                <button type="submit" disabled={booking}
                  className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg font-semibold hover:from-orange-700 disabled:opacity-50">
                  {booking ? "Processing..." : "Confirm Booking"}
                </button>
              </form>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Bus className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Select a tour to continue</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTicket;