import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bus, Ticket, Users, DollarSign, TrendingUp, 
  CheckCircle, XCircle, Trash2, Eye, LogOut, RefreshCw 
} from "lucide-react";
import { getAdminStats, getAllBookings, updateBookingStatus, deleteBooking } from "../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0, totalUsers: 0, totalRevenue: 0, pendingBookings: 0
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    console.log("Admin Dashboard - Checking auth:", { token: !!token, userData: !!userData });
    
    if (!token || !userData) {
      console.log("No token or user data, redirecting to login");
      navigate("/login");
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      console.log("Admin Dashboard - User role:", parsedUser.role);
      
      if (parsedUser.role !== "admin") {
        console.log("Not admin role, redirecting to login");
        navigate("/login");
        return;
      }
      
      setAdminUser(parsedUser);
      fetchData();
    } catch (error) {
      console.error("Error parsing user:", error);
      navigate("/login");
    }
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, bookingsData] = await Promise.all([
        getAdminStats(),
        getAllBookings()
      ]);
      setStats(statsData);
      setBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshData = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      alert(`Booking ${status} successfully!`);
      fetchData();
    } catch (error) {
      alert("Error updating status");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteBooking(bookingId);
        alert("Booking deleted!");
        fetchData();
      } catch (error) {
        alert("Error deleting");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Admin Navbar */}
      <nav className="bg-black border-b border-orange-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bus className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-white">Admin Panel</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-300">Admin: {adminUser?.name}</span>
              <button onClick={refreshData} disabled={refreshing} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white rounded-lg">
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <Ticket className="h-8 w-8 text-orange-500 mb-3" />
            <h3 className="text-gray-400 text-sm">Total Bookings</h3>
            <p className="text-2xl font-bold text-white">{stats.totalBookings}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <Users className="h-8 w-8 text-orange-500 mb-3" />
            <h3 className="text-gray-400 text-sm">Total Users</h3>
            <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <DollarSign className="h-8 w-8 text-orange-500 mb-3" />
            <h3 className="text-gray-400 text-sm">Total Revenue</h3>
            <p className="text-2xl font-bold text-white">₨ {stats.totalRevenue?.toLocaleString()}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <TrendingUp className="h-8 w-8 text-yellow-500 mb-3" />
            <h3 className="text-gray-400 text-sm">Pending</h3>
            <p className="text-2xl font-bold text-yellow-500">{stats.pendingBookings}</p>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-lg font-semibold text-white">All Bookings</h3>
          </div>
          <div className="p-4 overflow-x-auto">
            {bookings.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No bookings found</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="p-3 text-left text-xs text-gray-400">ID</th>
                    <th className="p-3 text-left text-xs text-gray-400">Customer</th>
                    <th className="p-3 text-left text-xs text-gray-400">Tour</th>
                    <th className="p-3 text-left text-xs text-gray-400">Amount</th>
                    <th className="p-3 text-left text-xs text-gray-400">Status</th>
                    <th className="p-3 text-left text-xs text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="p-3 text-orange-500 text-sm font-mono">{booking.bookingId}</td>
                      <td className="p-3">
                        <div className="text-white text-sm">{booking.fullName}</div>
                        <div className="text-gray-500 text-xs">{booking.email}</div>
                       </td>
                      <td className="p-3 text-gray-400 text-sm">{booking.tourName} </td>
                      <td className="p-3 text-white text-sm">{booking.tourPrice} </td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 
                          booking.status === 'confirmed' ? 'bg-green-500/20 text-green-500' : 
                          'bg-red-500/20 text-red-500'
                        }`}>
                          {booking.status}
                        </span>
                       </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button onClick={() => { setSelectedBooking(booking); setShowModal(true); }} className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded">
                            <Eye size={16} />
                          </button>
                          {booking.status === 'pending' && (
                            <>
                              <button onClick={() => handleStatusUpdate(booking._id, 'confirmed')} className="p-1.5 text-green-500 hover:bg-green-500/10 rounded">
                                <CheckCircle size={16} />
                              </button>
                              <button onClick={() => handleStatusUpdate(booking._id, 'cancelled')} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded">
                                <XCircle size={16} />
                              </button>
                            </>
                          )}
                          <button onClick={() => handleDeleteBooking(booking._id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded">
                            <Trash2 size={16} />
                          </button>
                        </div>
                       </td>
                     </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <h2 className="text-xl font-bold text-orange-500">Booking Details</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <p><span className="text-gray-400">ID:</span> <span className="text-white">{selectedBooking.bookingId}</span></p>
                <p><span className="text-gray-400">Customer:</span> <span className="text-white">{selectedBooking.fullName}</span></p>
                <p><span className="text-gray-400">Email:</span> <span className="text-white">{selectedBooking.email}</span></p>
                <p><span className="text-gray-400">Phone:</span> <span className="text-white">{selectedBooking.phone}</span></p>
                <p><span className="text-gray-400">CNIC:</span> <span className="text-white">{selectedBooking.cnic}</span></p>
                <p><span className="text-gray-400">Tour:</span> <span className="text-white">{selectedBooking.tourName}</span></p>
                <p><span className="text-gray-400">Amount:</span> <span className="text-white">{selectedBooking.tourPrice}</span></p>
                <p><span className="text-gray-400">Status:</span> <span className="text-white">{selectedBooking.status}</span></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;