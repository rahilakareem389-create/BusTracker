// components/userdashboard/RecommendedBusesSection.jsx
import { useState, useCallback, useMemo, useEffect } from "react";
import BusCard from "./BusCard";

// --- LOCAL STORAGE HELPERS ---
const STORAGE_KEYS = {
  BOOKINGS: "travel_booking_requests",
  ADMIN_CRED: "travel_admin_auth"
};

// Initialize default admin credentials (only once)
if (!localStorage.getItem(STORAGE_KEYS.ADMIN_CRED)) {
  localStorage.setItem(STORAGE_KEYS.ADMIN_CRED, JSON.stringify({ username: "admin", password: "admin123" }));
}

const getBookingRequests = () => {
  const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  return data ? JSON.parse(data) : [];
};

const saveBookingRequests = (bookings) => {
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
};

const addBookingRequest = (bookingData) => {
  const bookings = getBookingRequests();
  const newBooking = {
    id: Date.now(),
    ...bookingData,
    status: "pending",
    createdAt: new Date().toISOString()
  };
  bookings.push(newBooking);
  saveBookingRequests(bookings);
  return newBooking;
};

const updateBookingStatus = (bookingId, status) => {
  const bookings = getBookingRequests();
  const updated = bookings.map(b => b.id === bookingId ? { ...b, status, updatedAt: new Date().toISOString() } : b);
  saveBookingRequests(updated);
};

// --- PDF RECEIPT GENERATOR ---
const generatePDFReceipt = (booking, tour) => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Travel Booking Receipt - ${booking.id}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f2f5; padding: 40px 20px; }
          .receipt { max-width: 800px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; }
          .logo { font-size: 28px; font-weight: bold; margin-bottom: 8px; }
          .subtitle { font-size: 14px; opacity: 0.9; }
          .content { padding: 30px; }
          .title { font-size: 20px; color: #f97316; margin-bottom: 20px; border-left: 4px solid #f97316; padding-left: 15px; }
          .row { display: flex; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
          .label { width: 160px; font-weight: 600; color: #374151; }
          .value { flex: 1; color: #111827; }
          .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          .status-pending { background: #fed7aa; color: #92400e; }
          .status-approved { background: #d1fae5; color: #065f46; }
          .status-rejected { background: #fee2e2; color: #991b1b; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
          .print-btn { text-align: center; margin-top: 20px; }
          @media print {
            body { background: white; padding: 0; }
            .print-btn { display: none; }
            .receipt { box-shadow: none; margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="logo">🇵🇰 Pakistan Travels</div>
            <div class="subtitle">Official Booking Receipt</div>
          </div>
          <div class="content">
            <div class="title">Booking Information</div>
            <div class="row"><div class="label">Receipt Number:</div><div class="value">#${booking.id}</div></div>
            <div class="row"><div class="label">Booking Date:</div><div class="value">${new Date(booking.createdAt).toLocaleString()}</div></div>
            <div class="row"><div class="label">Status:</div><div class="value"><span class="status-badge status-${booking.status}">${booking.status.toUpperCase()}</span></div></div>
            
            <div class="title" style="margin-top: 20px;">Tour Details</div>
            <div class="row"><div class="label">Tour Name:</div><div class="value">${tour?.name || booking.tourName}</div></div>
            <div class="row"><div class="label">Route:</div><div class="value">${tour?.from || 'N/A'} → ${tour?.to || 'N/A'}</div></div>
            <div class="row"><div class="label">Tour Price:</div><div class="value">${tour?.price || booking.tourPrice}</div></div>
            
            <div class="title" style="margin-top: 20px;">Passenger Details</div>
            <div class="row"><div class="label">Full Name:</div><div class="value">${booking.fullName}</div></div>
            <div class="row"><div class="label">CNIC Number:</div><div class="value">${booking.cnic}</div></div>
            <div class="row"><div class="label">Phone Number:</div><div class="value">${booking.phone}</div></div>
            <div class="row"><div class="label">Email Address:</div><div class="value">${booking.email}</div></div>
            
            <div class="title" style="margin-top: 20px;">Payment Information</div>
            <div class="row"><div class="label">Payment Method:</div><div class="value">${booking.paymentMethod === 'jazzcash' ? 'JazzCash' : 'Bank Transfer'}</div></div>
            <div class="row"><div class="label">Transaction ID:</div><div class="value">${booking.transactionId || 'N/A'}</div></div>
            <div class="row"><div class="label">Amount Paid:</div><div class="value">${booking.tourPrice}</div></div>
          </div>
          <div class="footer">
            <p>This is a computer generated receipt. Valid only after admin approval.</p>
            <p>For support: support@pakistantravels.com | Helpline: 042-111-000-000</p>
            <p>Terms & conditions apply. This ticket is non-transferable.</p>
          </div>
        </div>
        <div class="print-btn">
          <button onclick="window.print();" style="background: #f97316; color: white; border: none; padding: 10px 30px; border-radius: 8px; font-size: 16px; cursor: pointer;">🖨️ Print / Save as PDF</button>
        </div>
        <script>window.onload = function() { setTimeout(() => { window.print(); }, 500); };</script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

// --- BOOKING FORM MODAL (FIXED - Added useCallback) ---
const BookingFormModal = ({ isOpen, onClose, tour, onBookingSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    cnic: "",
    phone: "",
    email: "",
    transactionId: "",
    paymentMethod: "jazzcash"
  });
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fixed: Added proper cleanup and dependencies
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setFormData({
        fullName: "", cnic: "", phone: "", email: "", transactionId: "", paymentMethod: "jazzcash"
      });
    }
  }, [isOpen]);

  const handleChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const validateStep1 = useCallback(() => {
    if (!formData.fullName.trim()) return "Full name is required";
    if (!formData.cnic.trim() || !/^\d{5}-\d{7}-\d$/.test(formData.cnic)) return "Valid CNIC required (Format: 12345-1234567-1)";
    if (!formData.phone.trim() || formData.phone.length < 10) return "Valid phone number required (11 digits)";
    if (!formData.email.trim() || !formData.email.includes("@")) return "Valid email address required";
    return null;
  }, [formData.fullName, formData.cnic, formData.phone, formData.email]);

  const handleNext = useCallback(() => {
    const error = validateStep1();
    if (error) {
      alert(error);
      return;
    }
    setStep(2);
  }, [validateStep1]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (step === 1) {
      handleNext();
      return;
    }
    if (!formData.transactionId.trim()) {
      alert("Please enter your JazzCash/Bank transaction ID");
      return;
    }
    setIsSubmitting(true);
    
    const bookingRequest = {
      tourId: tour.id,
      tourName: tour.name,
      tourPrice: tour.price,
      tourFrom: tour.from,
      tourTo: tour.to,
      ...formData
    };
    
    const newBooking = addBookingRequest(bookingRequest);
    onBookingSubmit(newBooking, tour);
    setIsSubmitting(false);
    onClose();
    alert("✅ Booking request submitted successfully!\n\nYour request is pending admin approval. You will receive a confirmation once approved.");
  }, [step, formData, tour, onBookingSubmit, onClose, handleNext]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">📋 Book Your Tour</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5">
          {step === 1 ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g., Muhammad Ali" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500" required />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">CNIC Number *</label>
                <input type="text" name="cnic" value={formData.cnic} onChange={handleChange} placeholder="12345-1234567-1" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500" required />
                <p className="text-xs text-gray-500 mt-1">Format: 5 digits - 7 digits - 1 digit</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="03XXXXXXXXX" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500" required />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500" required />
              </div>
            </>
          ) : (
            <>
              <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 mb-5">
                <p className="text-orange-400 text-sm font-semibold mb-2">🎫 Tour: {tour.name}</p>
                <p className="text-white text-lg font-bold">{tour.price}</p>
                <p className="text-gray-400 text-xs">{tour.from} → {tour.to}</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Payment Method</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input type="radio" name="paymentMethod" value="jazzcash" checked={formData.paymentMethod === "jazzcash"} onChange={handleChange} className="w-4 h-4" />
                    <span>💚 JazzCash</span>
                  </label>
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input type="radio" name="paymentMethod" value="bank" checked={formData.paymentMethod === "bank"} onChange={handleChange} className="w-4 h-4" />
                    <span>🏦 Bank Transfer</span>
                  </label>
                </div>
              </div>
              
              <div className="mb-5 bg-gray-800 p-4 rounded-lg">
                <p className="text-orange-400 text-sm font-semibold mb-2">📱 JazzCash Payment Instructions:</p>
                <p className="text-gray-300 text-xs mb-1">1. Open JazzCash app → Send Money</p>
                <p className="text-gray-300 text-xs mb-1">2. Account: <strong className="text-white">03 1234567890</strong> (Pakistan Travels)</p>
                <p className="text-gray-300 text-xs mb-2">3. Amount: <strong className="text-white">{tour.price}</strong></p>
                <p className="text-yellow-400 text-xs">⚠️ After payment, enter transaction ID below:</p>
              </div>
              
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-2">Transaction ID *</label>
                <input type="text" name="transactionId" value={formData.transactionId} onChange={handleChange} placeholder="JazzCash transaction ID / Bank reference number" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500" required />
              </div>
              
              <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3 mb-4">
                <p className="text-yellow-400 text-xs">⏳ Your booking will remain <strong>PENDING</strong> until admin verifies your payment. You will receive confirmation via email.</p>
              </div>
            </>
          )}
          
          <div className="flex gap-3 mt-6">
            {step === 2 && (
              <button type="button" onClick={() => setStep(1)} className="flex-1 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                ← Back
              </button>
            )}
            <button type="submit" disabled={isSubmitting} className="flex-1 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-700 hover:to-orange-600 transition disabled:opacity-50 font-semibold">
              {step === 1 ? "Proceed to Payment →" : (isSubmitting ? "Submitting..." : "Confirm Booking")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- ADMIN DASHBOARD (FIXED - Added useCallback and proper dependencies) ---
const AdminDashboard = ({ onClose, onRefresh }) => {
  const [bookings, setBookings] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");

  const loadBookings = useCallback(() => {
    setBookings(getBookingRequests());
    if (onRefresh) onRefresh();
  }, [onRefresh]);

  useEffect(() => {
    if (isLoggedIn) {
      loadBookings();
      const interval = setInterval(loadBookings, 5000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, loadBookings]);

  const handleLogin = useCallback((e) => {
    e.preventDefault();
    const admin = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_CRED));
    if (username === admin.username && password === admin.password) {
      setIsLoggedIn(true);
      loadBookings();
    } else {
      alert("❌ Invalid admin credentials");
    }
  }, [username, password, loadBookings]);

  const handleStatusChange = useCallback((bookingId, newStatus) => {
    updateBookingStatus(bookingId, newStatus);
    loadBookings();
    alert(`✅ Booking #${bookingId} has been ${newStatus.toUpperCase()}`);
  }, [loadBookings]);

  const filteredBookings = bookings.filter(b => {
    if (activeTab !== "all" && b.status !== activeTab) return false;
    if (searchTerm) {
      return b.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             b.cnic.includes(searchTerm) ||
             b.phone.includes(searchTerm);
    }
    return true;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    approved: bookings.filter(b => b.status === "approved").length,
    rejected: bookings.filter(b => b.status === "rejected").length
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-gray-700">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🔐</div>
            <h2 className="text-2xl font-bold text-white">Admin Login</h2>
            <p className="text-gray-400 text-sm mt-1">Access booking management panel</p>
          </div>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mb-3 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500" required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-5 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500" required />
            <button type="submit" className="w-full py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-700 hover:to-orange-600 transition font-semibold">Login to Dashboard</button>
            <button type="button" onClick={onClose} className="w-full mt-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">Close</button>
          </form>
          <p className="text-center text-gray-500 text-xs mt-4">Default: admin / admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl">
          <div className="flex justify-between items-center p-6 border-b border-gray-800">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">📊 Admin Dashboard</h2>
              <p className="text-gray-400 text-sm mt-1">Manage all booking requests</p>
            </div>
            <button onClick={() => { setIsLoggedIn(false); onClose(); }} className="text-gray-400 hover:text-white text-2xl">&times;</button>
          </div>
          
          <div className="grid grid-cols-4 gap-4 p-6 border-b border-gray-800">
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-gray-400 text-sm">Total Bookings</div>
            </div>
            <div className="bg-yellow-900/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
              <div className="text-gray-400 text-sm">Pending</div>
            </div>
            <div className="bg-green-900/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{stats.approved}</div>
              <div className="text-gray-400 text-sm">Approved</div>
            </div>
            <div className="bg-red-900/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
              <div className="text-gray-400 text-sm">Rejected</div>
            </div>
          </div>
          
          <div className="p-6 border-b border-gray-800">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-2">
                {["all", "pending", "approved", "rejected"].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg capitalize transition ${activeTab === tab ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                    {tab} ({tab === "all" ? stats.total : stats[tab]})
                  </button>
                ))}
              </div>
              <input type="text" placeholder="🔍 Search by name, CNIC, phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white w-80 focus:outline-none focus:border-orange-500" />
            </div>
          </div>
          
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No bookings found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map(booking => {
                  const tour = allTours.find(t => t.id === booking.tourId);
                  return (
                    <div key={booking.id} className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition">
                      <div className="flex flex-wrap justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-orange-400 font-mono text-sm">#{booking.id}</span>
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${booking.status === 'approved' ? 'bg-green-800 text-green-200' : booking.status === 'rejected' ? 'bg-red-800 text-red-200' : 'bg-yellow-800 text-yellow-200'}`}>
                              {booking.status}
                            </span>
                          </div>
                          <p className="font-bold text-white text-lg">{booking.fullName}</p>
                          <p className="text-sm text-gray-400">CNIC: {booking.cnic} | Phone: {booking.phone}</p>
                          <p className="text-sm text-orange-400 mt-1">🎫 {booking.tourName} | {booking.tourPrice}</p>
                          <p className="text-xs text-gray-500 mt-1">📅 {new Date(booking.createdAt).toLocaleString()}</p>
                          <p className="text-xs text-gray-500">💳 {booking.paymentMethod === 'jazzcash' ? 'JazzCash' : 'Bank Transfer'} | TXN: {booking.transactionId}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {booking.status === "pending" && (
                            <>
                              <button onClick={() => handleStatusChange(booking.id, "approved")} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition flex items-center gap-1">✅ Approve</button>
                              <button onClick={() => handleStatusChange(booking.id, "rejected")} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition flex items-center gap-1">❌ Reject</button>
                            </>
                          )}
                          <button onClick={() => generatePDFReceipt(booking, tour)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition flex items-center gap-1">📄 Download Receipt</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-800 text-center text-gray-500 text-xs">
            Auto-refreshes every 5 seconds
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPLETE TOURS DATABASE (36 Tours across 9 Categories) - ALL PRESERVED ---
const allTours = [
  // Family Tours (1-7)
  { id: 1, name: "Naran Kaghan Family Tour", from: "Islamabad", to: "Naran Kaghan", time: "07:00 AM", price: "₨ 4,500", seats: 45, rating: 4.8, duration: "8h", type: "Family Tour", description: "Beautiful valleys & lakes for family", images: ["https://images.pexels.com/photos/2614816/pexels-photo-2614816.jpeg?w=500"], amenities: ["AC Bus", "Meal Included", "Guide", "Hotel Stay"] },
  { id: 2, name: "Murree Family Getaway", from: "Rawalpindi", to: "Murree", time: "06:00 AM", price: "₨ 2,500", seats: 50, rating: 4.6, duration: "2h", type: "Family Tour", description: "Perfect family picnic spot", images: ["https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?w=500"], amenities: ["AC Bus", "Breakfast", "Sightseeing"] },
  { id: 3, name: "Swat Valley Family Tour", from: "Peshawar", to: "Swat", time: "07:30 AM", price: "₨ 3,500", seats: 40, rating: 4.7, duration: "5h", type: "Family Tour", description: "Switzerland of Pakistan", images: ["https://images.pexels.com/photos/842519/pexels-photo-842519.jpeg?w=500"], amenities: ["AC Bus", "Meal Included", "Guide"] },
  { id: 4, name: "Neelum Valley Family Tour", from: "Muzaffarabad", to: "Neelum Valley", time: "06:30 AM", price: "₨ 5,500", seats: 35, rating: 4.8, duration: "7h", type: "Family Tour", description: "Kashmir's paradise", images: ["https://images.pexels.com/photos/3369587/pexels-photo-3369587.jpeg?w=500"], amenities: ["AC Bus", "Meals", "Hotel Stay", "Guide"] },
  { id: 5, name: "Quetta Family Valley Tour", from: "Quetta", to: "Ziarat", time: "08:00 AM", price: "₨ 3,000", seats: 35, rating: 4.6, duration: "5h", type: "Family Tour", description: "Juniper forests for families", images: ["https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?w=500"], amenities: ["AC Bus", "Lunch", "Sightseeing"] },
  { id: 6, name: "Shogran Family Tour", from: "Islamabad", to: "Shogran", time: "07:00 AM", price: "₨ 4,000", seats: 40, rating: 4.7, duration: "6h", type: "Family Tour", description: "Beautiful pine forest", images: ["https://images.unsplash.com/photo-1544620347-c4fd4a3d5957"], amenities: ["AC Bus", "Meal Included", "Guide"] },
  { id: 7, name: "Ayubia Family Tour", from: "Rawalpindi", to: "Ayubia", time: "08:00 AM", price: "₨ 2,800", seats: 45, rating: 4.6, duration: "3h", type: "Family Tour", description: "Chairlift & nature", images: ["https://images.pexels.com/photos/2442906/pexels-photo-2442906.jpeg?w=500"], amenities: ["AC Bus", "Chairlift Ticket", "Snacks"] },
  // Couple Tours (8-14)
  { id: 8, name: "Hunza Couple Retreat", from: "Gilgit", to: "Hunza", time: "08:00 AM", price: "₨ 6,000", seats: 35, rating: 4.9, duration: "4h", type: "Couple Tour", description: "Romantic mountain views", images: ["https://images.pexels.com/photos/258117/pexels-photo-258117.jpeg?w=500"], amenities: ["AC Bus", "Luxury Hotel", "Candle Light Dinner", "Guide"] },
  { id: 9, name: "Fairy Meadows Couple Tour", from: "Rawalpindi", to: "Fairy Meadows", time: "04:00 AM", price: "₨ 7,500", seats: 25, rating: 5.0, duration: "14h", type: "Couple Tour", description: "Perfect for honeymoon", images: ["https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?w=500"], amenities: ["Jeep Service", "Camping", "Bonfire", "Meals"] },
  { id: 10, name: "Ratti Gali Lake Couple Tour", from: "Islamabad", to: "Ratti Gali", time: "05:00 AM", price: "₨ 6,500", seats: 30, rating: 4.9, duration: "10h", type: "Couple Tour", description: "Alpine blue lake experience", images: ["https://images.pexels.com/photos/3799171/pexels-photo-3799171.jpeg?w=500"], amenities: ["AC Bus", "Pony Ride", "Photography", "Lunch"] },
  { id: 11, name: "Kumrat Valley Couple Tour", from: "Peshawar", to: "Kumrat", time: "06:00 AM", price: "₨ 5,800", seats: 30, rating: 4.8, duration: "9h", type: "Couple Tour", description: "Hidden gem for couples", images: ["https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg?w=500"], amenities: ["AC Bus", "Camping", "Bonfire", "Meals"] },
  { id: 12, name: "Rama Lake Couple Tour", from: "Skardu", to: "Rama Lake", time: "06:00 AM", price: "₨ 7,000", seats: 30, rating: 4.8, duration: "8h", type: "Couple Tour", description: "Peaceful lake view", images: ["https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?w=500"], amenities: ["AC Bus", "Photography", "Lunch", "Guide"] },
  { id: 13, name: "Attabad Lake Couple Tour", from: "Gilgit", to: "Attabad", time: "07:00 AM", price: "₨ 5,500", seats: 35, rating: 4.8, duration: "5h", type: "Couple Tour", description: "Turquoise blue water", images: ["https://images.pexels.com/photos/416676/pexels-photo-416676.jpeg?w=500"], amenities: ["Boat Ride", "Lunch", "Photography"] },
  { id: 14, name: "Shangrila Resort Couple Tour", from: "Skardu", to: "Shangrila Resort", time: "09:00 AM", price: "₨ 8,000", seats: 30, rating: 4.9, duration: "2 days", type: "Couple Tour", description: "Heaven on earth", images: ["https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?w=500"], amenities: ["Luxury Resort", "All Meals", "Activities", "Spa"] },
  // City Tours (15-21)
  { id: 15, name: "Karachi City Explorer", from: "Karachi", to: "Clifton & Sea View", time: "09:00 AM", price: "₨ 1,500", seats: 50, rating: 4.3, duration: "4h", type: "City Tour", description: "Beaches & food street", images: ["https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?w=500"], amenities: ["AC Bus", "Guide", "Food Street Visit"] },
  { id: 16, name: "Lahore Historical Tour", from: "Lahore", to: "Badshahi Mosque", time: "10:00 AM", price: "₨ 1,800", seats: 45, rating: 4.7, duration: "5h", type: "City Tour", description: "Historical landmarks", images: ["https://images.pexels.com/photos/3837723/pexels-photo-3837723.jpeg?w=500"], amenities: ["AC Bus", "Entry Tickets", "Guide", "Lunch"] },
  { id: 17, name: "Multan City Tour", from: "Multan", to: "Multan City", time: "08:00 AM", price: "₨ 1,200", seats: 40, rating: 4.4, duration: "3h", type: "City Tour", description: "Sufi shrines & bazaars", images: ["https://images.pexels.com/photos/2565416/pexels-photo-2565416.jpeg?w=500"], amenities: ["AC Bus", "Guide", "Shopping"] },
  { id: 18, name: "Peshawar City Tour", from: "Peshawar", to: "Peshawar City", time: "09:00 AM", price: "₨ 1,000", seats: 40, rating: 4.3, duration: "3h", type: "City Tour", description: "Historic bazaar tour", images: ["https://images.pexels.com/photos/3312987/pexels-photo-3312987.jpeg?w=500"], amenities: ["AC Bus", "Guide", "Food tasting"] },
  { id: 19, name: "Islamabad City Tour", from: "Islamabad", to: "Faisal Mosque", time: "10:00 AM", price: "₨ 1,500", seats: 45, rating: 4.6, duration: "4h", type: "City Tour", description: "Modern city landmarks", images: ["https://images.pexels.com/photos/3837723/pexels-photo-3837723.jpeg?w=500"], amenities: ["AC Bus", "Guide", "Monument Visits"] },
  { id: 20, name: "Faisalabad City Tour", from: "Faisalabad", to: "Clock Tower", time: "09:00 AM", price: "₨ 1,200", seats: 40, rating: 4.3, duration: "3h", type: "City Tour", description: "Textile city tour", images: ["https://images.pexels.com/photos/2565416/pexels-photo-2565416.jpeg?w=500"], amenities: ["AC Bus", "Market Visit", "Guide"] },
  { id: 21, name: "Rawalpindi City Tour", from: "Rawalpindi", to: "Rawalpindi Saddar", time: "10:00 AM", price: "₨ 1,000", seats: 50, rating: 4.2, duration: "3h", type: "City Tour", description: "Military & commercial hub", images: ["https://images.pexels.com/photos/3312987/pexels-photo-3312987.jpeg?w=500"], amenities: ["AC Bus", "Guide", "Shopping"] },
  // Adventure Tours (22-26)
  { id: 22, name: "Skardu Adventure", from: "Islamabad", to: "Skardu", time: "05:00 AM", price: "₨ 8,000", seats: 30, rating: 4.9, duration: "12h", type: "Adventure Tour", description: "Cold desert adventure", images: ["https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?w=500"], amenities: ["Flight Ticket", "Hotel Stay", "Meals", "Guide"] },
  { id: 23, name: "Deosai Plains Adventure", from: "Skardu", to: "Deosai", time: "05:30 AM", price: "₨ 9,000", seats: 25, rating: 4.9, duration: "9h", type: "Adventure Tour", description: "World's highest plateau", images: ["https://images.pexels.com/photos/3799171/pexels-photo-3799171.jpeg?w=500"], amenities: ["4x4 Jeep", "Camping", "Meals", "Guide"] },
  { id: 24, name: "Trango Towers Trek", from: "Gilgit", to: "Trango Towers", time: "04:00 AM", price: "₨ 12,000", seats: 20, rating: 5.0, duration: "3 days", type: "Adventure Tour", description: "Expert climbers paradise", images: ["https://images.pexels.com/photos/258117/pexels-photo-258117.jpeg?w=500"], amenities: ["Professional Guide", "Equipment", "Camping", "Meals"] },
  { id: 25, name: "K2 Base Camp Trek", from: "Skardu", to: "K2 Base Camp", time: "03:00 AM", price: "₨ 25,000", seats: 15, rating: 5.0, duration: "12 days", type: "Adventure Tour", description: "World's toughest trek", images: ["https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?w=500"], amenities: ["Full Support", "Porters", "Equipment", "Medical Kit"] },
  { id: 26, name: "Nanga Parbat Trek", from: "Gilgit", to: "Nanga Parbat", time: "04:00 AM", price: "₨ 18,000", seats: 20, rating: 4.9, duration: "8 days", type: "Adventure Tour", description: "Killer mountain expedition", images: ["https://images.pexels.com/photos/258117/pexels-photo-258117.jpeg?w=500"], amenities: ["Professional Guide", "Camping", "Meals", "Transport"] },
  // College/School Educational Tours (27-30)
  { id: 27, name: "Lahore College Educational Tour", from: "Lahore", to: "Lahore Museum", time: "09:00 AM", price: "₨ 1,200", seats: 55, rating: 4.5, duration: "6h", type: "College Tour", description: "Educational historical tour", images: ["https://images.pexels.com/photos/3837723/pexels-photo-3837723.jpeg?w=500"], amenities: ["AC Bus", "Entry Tickets", "Educational Guide", "Lunch"] },
  { id: 28, name: "Taxila University Tour", from: "Rawalpindi", to: "Taxila", time: "08:00 AM", price: "₨ 1,800", seats: 50, rating: 4.7, duration: "5h", type: "College Tour", description: "Ancient university ruins", images: ["https://images.pexels.com/photos/2565416/pexels-photo-2565416.jpeg?w=500"], amenities: ["AC Bus", "Archaeological Guide", "Entry Tickets", "Lunch"] },
  { id: 29, name: "Mohenjo Daro School Tour", from: "Sukkur", to: "Mohenjo Daro", time: "07:00 AM", price: "₨ 2,500", seats: 45, rating: 4.8, duration: "8h", type: "School Tour", description: "Indus Valley civilization", images: ["https://images.pexels.com/photos/3312987/pexels-photo-3312987.jpeg?w=500"], amenities: ["AC Bus", "Expert Guide", "Entry Tickets", "Meals"] },
  { id: 30, name: "Pakistan Museum Tour", from: "Karachi", to: "Pakistan Museum", time: "10:00 AM", price: "₨ 1,000", seats: 50, rating: 4.4, duration: "4h", type: "School Tour", description: "National heritage", images: ["https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?w=500"], amenities: ["AC Bus", "Guide", "Entry Tickets"] },
  // Group Tours (31-33)
  { id: 31, name: "Northern Areas Group Tour", from: "Islamabad", to: "Gilgit-Baltistan", time: "06:00 AM", price: "₨ 15,000", seats: 40, rating: 4.9, duration: "7 days", type: "Group Tour", description: "Complete northern exploration", images: ["https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?w=500"], amenities: ["AC Transport", "Hotel Stay", "All Meals", "Sightseeing"] },
  { id: 32, name: "Sindh Group Heritage Tour", from: "Karachi", to: "Thatta", time: "08:00 AM", price: "₨ 3,500", seats: 45, rating: 4.6, duration: "2 days", type: "Group Tour", description: "Sindh's cultural heritage", images: ["https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?w=500"], amenities: ["AC Bus", "Hotel Stay", "Meals", "Guide"] },
  { id: 33, name: "Punjab Group History Tour", from: "Lahore", to: "Multiple Cities", time: "07:00 AM", price: "₨ 8,000", seats: 50, rating: 4.7, duration: "5 days", type: "Group Tour", description: "Punjab's historical circuit", images: ["https://images.pexels.com/photos/3837723/pexels-photo-3837723.jpeg?w=500"], amenities: ["AC Transport", "Hotel Stay", "All Meals", "Historical Guide"] },
  // Hotel/Luxury Tours (34-36)
  { id: 34, name: "PC Bhurban Hotel Tour", from: "Islamabad", to: "Bhurban", time: "11:00 AM", price: "₨ 8,000", seats: 30, rating: 4.8, duration: "2 days", type: "Hotel Tour", description: "Luxury resort experience", images: ["https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?w=500"], amenities: ["Luxury Hotel", "All Meals", "Spa Access", "Activities"] },
  { id: 35, name: "Serena Hotel Tour", from: "Gilgit", to: "Serena Hunza", time: "12:00 PM", price: "₨ 10,000", seats: 25, rating: 4.9, duration: "3 days", type: "Hotel Tour", description: "5-star mountain resort", images: ["https://images.pexels.com/photos/258117/pexels-photo-258117.jpeg?w=500"], amenities: ["Luxury Stay", "All Meals", "Mountain View", "Activities"] },
  { id: 36, name: "Faletti's Hotel Tour", from: "Lahore", to: "Faletti's Hotel", time: "02:00 PM", price: "₨ 5,000", seats: 35, rating: 4.6, duration: "2 days", type: "Hotel Tour", description: "Historical luxury hotel", images: ["https://images.pexels.com/photos/3837723/pexels-photo-3837723.jpeg?w=500"], amenities: ["Heritage Hotel", "All Meals", "Historical Tour", "High Tea"] }
];

// --- MAIN COMPONENT (FIXED - Added useCallback and useMemo) ---
const RecommendedBusesSection = ({ buses, onViewAll, onBookNow, userRole = "user", onSaveTour }) => {
  const [showAllTours, setShowAllTours] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTour, setSelectedTour] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Memoize filtered tours to prevent unnecessary recalculations
  const filteredTours = useMemo(() => {
    if (selectedCategory === "All") return allTours;
    return allTours.filter(tour => tour.type === `${selectedCategory} Tour`);
  }, [selectedCategory]);

  const displayTours = useMemo(() => {
    return showAllTours ? filteredTours : filteredTours.slice(0, 9);
  }, [showAllTours, filteredTours]);

  // Memoize category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: allTours.length };
    const categories = ["Family", "Couple", "City", "Adventure", "College", "School", "Group", "Hotel"];
    categories.forEach(cat => {
      counts[cat] = allTours.filter(t => t.type === `${cat} Tour`).length;
    });
    return counts;
  }, []);

  const handleViewAll = useCallback(() => {
    setShowAllTours(prev => !prev);
    if (onViewAll) onViewAll();
  }, [onViewAll]);

  const handleCategoryClick = useCallback((category) => {
    setSelectedCategory(category);
    setShowAllTours(false);
  }, []);

  const handleBookNow = useCallback((tour) => {
    if (userRole === "admin") {
      alert("Admin cannot make bookings. Please switch to user role.");
      return;
    }
    setSelectedTour(tour);
    setShowBookingModal(true);
    if (onBookNow) onBookNow(tour);
  }, [userRole, onBookNow]);

  const handleBookingSubmit = useCallback((booking, tour) => {
    console.log("Booking submitted:", booking);
  }, []);

  const categories = ["All", "Family", "Couple", "City", "Adventure", "College", "School", "Group", "Hotel"];

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Pakistan Tours</h3>
          <p className="text-xs text-gray-500 mt-1">Discover the beauty of Pakistan with our {allTours.length}+ curated tours</p>
        </div>
        <div className="flex gap-3">
          {userRole === "admin" && (
            <button onClick={() => setShowAdminDashboard(true)} className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-700 transition flex items-center gap-2">
              🔐 Admin Panel
            </button>
          )}
          <button onClick={handleViewAll} className="text-orange-500 text-sm hover:underline transition flex items-center gap-1">
            {showAllTours ? "Show Less ↑" : `View All ${filteredTours.length} Tours →`}
          </button>
        </div>
      </div>
      
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button 
            key={category} 
            onClick={() => handleCategoryClick(category)} 
            className={`px-3 py-1 text-xs rounded-full transition ${selectedCategory === category ? "bg-orange-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-orange-600 hover:text-white"}`}
          >
            {category} ({categoryCounts[category] || 0})
          </button>
        ))}
      </div>
      
      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayTours.map((tour) => (
          <BusCard key={tour.id} bus={tour} onBookNow={() => handleBookNow(tour)} onSaveTour={onSaveTour} userRole={userRole} />
        ))}
      </div>
      
      {/* No Results */}
      {displayTours.length === 0 && (
        <div className="text-center py-12 bg-black rounded-lg border border-gray-800">
          <p className="text-gray-400">No tours found in this category.</p>
        </div>
      )}
      
      {/* Load More */}
      {!showAllTours && filteredTours.length > 9 && (
        <div className="text-center mt-6">
          <button onClick={handleViewAll} className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
            Load More Tours ({filteredTours.length - 9} more)
          </button>
        </div>
      )}
      
      {/* Showing Info */}
      <div className="text-center mt-4">
        <p className="text-xs text-gray-500">Showing {displayTours.length} of {filteredTours.length} tours</p>
      </div>
      
      {/* Modals */}
      {showBookingModal && selectedTour && (
        <BookingFormModal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} tour={selectedTour} onBookingSubmit={handleBookingSubmit} />
      )}
      
      {showAdminDashboard && (
        <AdminDashboard onClose={() => setShowAdminDashboard(false)} onRefresh={() => console.log("Dashboard refreshed")} />
      )}
    </div>
  );
};

export default RecommendedBusesSection;