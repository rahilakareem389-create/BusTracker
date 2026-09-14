import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bus, Calendar, CreditCard, Star } from "lucide-react";
import { getUserBookings, getStats, updateBookingStatus } from "../services/api";

// Import components
import TopNavigation from "../components/userdashboard/TopNavigation";
import WelcomeBanner from "../components/userdashboard/WelcomeBanner";
import StatsCard from "../components/userdashboard/StatsCard";
import DashboardTabs from "../components/userdashboard/DashboardTabs";
import UpcomingTripsSection from "../components/userdashboard/UpcomingTripsSection";
import PastTripsSection from "../components/userdashboard/PastTripsSection";
import RecommendedBusesSection from "../components/userdashboard/RecommendedBusesSection";
import ProfileSection from "../components/userdashboard/ProfileSection";

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);
  const [savedTours, setSavedTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalSpent: 0,
    upcomingTrips: 0,
    rewardPoints: 0
  });

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Fetch bookings from backend API
      const userBookings = await getUserBookings();
      
      // Separate upcoming and past trips
      const upcoming = userBookings.filter(booking => 
        booking.status === 'pending' || booking.status === 'confirmed'
      );
      const past = userBookings.filter(booking => 
        booking.status === 'completed' || booking.status === 'cancelled'
      );
      
      setUpcomingTrips(upcoming);
      setPastTrips(past);
      
      // Calculate stats
      const totalSpent = userBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      setStats({
        totalTrips: userBookings.length,
        totalSpent: totalSpent,
        upcomingTrips: upcoming.length,
        rewardPoints: Math.floor(totalSpent / 100) * 10
      });
      
      // Load saved tours from localStorage
      const saved = JSON.parse(localStorage.getItem('savedTours') || '[]');
      setSavedTours(saved);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!userData || !token) {
      navigate("/login");
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role === "admin") {
      navigate("/admin-dashboard");
      return;
    }
    
    setUser(parsedUser);
    loadUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  const handleBookNow = (tour) => {
    navigate("/book", { state: { tour } });
  };

  const handleSaveTour = (tour) => {
    const saved = JSON.parse(localStorage.getItem('savedTours') || '[]');
    const exists = saved.some(s => s._id === tour._id || s.id === tour.id);
    
    if (!exists) {
      saved.push(tour);
      localStorage.setItem('savedTours', JSON.stringify(saved));
      setSavedTours(saved);
      alert(`${tour.name} saved to your list!`);
    } else {
      alert('Tour already saved!');
    }
  };

  const handleRemoveSavedTour = (tourId) => {
    const saved = savedTours.filter(t => (t._id || t.id) !== tourId);
    localStorage.setItem('savedTours', JSON.stringify(saved));
    setSavedTours(saved);
    alert('Tour removed from saved list');
  };

  const handleCancelTrip = async (trip) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await updateBookingStatus(trip._id, 'cancelled');
        alert('Booking cancelled successfully!');
        loadUserData();
      } catch (error) {
        alert('Error cancelling booking');
      }
    }
  };

  const handleDownloadTicket = (trip) => {
    const receiptContent = `
========================================
    BUS TRACKER PAKISTAN
    OFFICIAL TICKET
========================================

Booking ID: ${trip.bookingId}
Date: ${new Date(trip.bookingDate).toLocaleDateString()}
Status: ${trip.status?.toUpperCase() || 'CONFIRMED'}

----------------------------------------
TRIP DETAILS
----------------------------------------
Tour: ${trip.tourName}
Route: ${trip.tourFrom} → ${trip.tourTo}
Time: ${trip.time || 'N/A'}
Duration: ${trip.duration || 'N/A'}

----------------------------------------
PASSENGER DETAILS
----------------------------------------
Name: ${trip.fullName}
Email: ${trip.email}
Phone: ${trip.phone}
CNIC: ${trip.cnic}

----------------------------------------
PAYMENT DETAILS
----------------------------------------
Seats: ${trip.seats || 1}
Total Amount: ₨ ${trip.totalAmount?.toLocaleString()}
Payment Method: ${trip.paymentMethod || 'Cash'}
Transaction ID: ${trip.transactionId || 'N/A'}

Thank you for choosing BusTracker Pakistan!
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ticket_${trip.bookingId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = ["overview", "upcoming", "past", "saved", "profile"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <TopNavigation user={user} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeBanner userName={user?.name?.split(' ')[0] || "Guest"} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Trips" value={stats.totalTrips.toString()} icon={Bus} color="bg-orange-500" change="Lifetime trips" />
          <StatsCard title="Total Spent" value={`₨ ${stats.totalSpent.toLocaleString()}`} icon={CreditCard} color="bg-green-600" change="All bookings" />
          <StatsCard title="Upcoming Trips" value={stats.upcomingTrips.toString()} icon={Calendar} color="bg-purple-600" change="Ready to travel" />
          <StatsCard title="Reward Points" value={stats.rewardPoints.toString()} icon={Star} color="bg-yellow-600" change="Earn more points" />
        </div>
        
        <div className="bg-black rounded-xl shadow-sm mb-8 border border-gray-800">
          <DashboardTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            tabs={tabs}
          />
          
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-8">
                {upcomingTrips.length > 0 && (
                  <UpcomingTripsSection 
                    trips={upcomingTrips.slice(0, 3)}
                    onViewDetails={() => {}}
                    onCancel={handleCancelTrip}
                  />
                )}
                <RecommendedBusesSection 
                  onBookNow={handleBookNow}
                  onSaveTour={handleSaveTour}
                  userRole="user"
                />
              </div>
            )}
            
            {activeTab === "upcoming" && (
              <UpcomingTripsSection 
                trips={upcomingTrips}
                onViewDetails={() => {}}
                onCancel={handleCancelTrip}
              />
            )}
            
            {activeTab === "past" && (
              <PastTripsSection 
                trips={pastTrips}
                onDownloadTicket={handleDownloadTicket}
              />
            )}
            
            {activeTab === "saved" && (
              <SavedToursSection 
                tours={savedTours}
                onRemove={handleRemoveSavedTour}
                onBookNow={handleBookNow}
              />
            )}
            
            {activeTab === "profile" && (
              <ProfileSection user={user} stats={stats} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Saved Tours Section Component
const SavedToursSection = ({ tours, onRemove, onBookNow }) => {
  if (!tours || tours.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No saved tours yet</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Saved Tours</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tours.map((tour) => (
          <div key={tour._id || tour.id} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <h4 className="text-white font-semibold">{tour.name}</h4>
            <p className="text-gray-400 text-sm">{tour.from} → {tour.to}</p>
            <p className="text-orange-500 font-bold mt-2">₨ {tour.price}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => onBookNow(tour)} className="flex-1 px-3 py-1 bg-orange-600 text-white rounded-lg text-sm">
                Book Now
              </button>
              <button onClick={() => onRemove(tour._id || tour.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;