// components/dashboard/PastTripCard.jsx
import { useState } from "react";
import { Download, Eye, X, MapPin, Calendar, Clock, Users, CreditCard, CheckCircle, Printer, User, Phone, Mail, IdCard } from "lucide-react";

const PastTripCard = ({ trip, onDownloadTicket }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: "bg-green-600 text-white",
      pending: "bg-yellow-600 text-white",
      completed: "bg-blue-600 text-white",
      cancelled: "bg-red-600 text-white"
    };
    return styles[status] || styles.completed;
  };

  const downloadDetailedReceipt = () => {
    const receiptContent = `
========================================
    BUS TRACKER PAKISTAN
    OFFICIAL TRIP RECEIPT
========================================

Booking ID: ${trip.bookingId || `TRIP-${trip.id}`}
Date: ${trip.date}
Status: ${trip.status?.toUpperCase() || 'COMPLETED'}

----------------------------------------
TRIP DETAILS
----------------------------------------
Tour: ${trip.busName || trip.bus}
Type: ${trip.type || 'Standard Tour'}
Route: ${trip.from} → ${trip.to}
Date: ${trip.date}
Time: ${trip.time}
Duration: ${trip.duration || 'N/A'}

----------------------------------------
CUSTOMER INFORMATION
----------------------------------------
Name: ${trip.customerName || 'Guest User'}
Email: ${trip.email || 'N/A'}
Phone: ${trip.phone || 'N/A'}
CNIC: ${trip.cnic || 'N/A'}
Address: ${trip.address || 'N/A'}

----------------------------------------
PAYMENT DETAILS
----------------------------------------
Seats Booked: ${trip.seats}
Price per Seat: ${trip.pricePerSeat ? `₨ ${trip.pricePerSeat}` : 'N/A'}
Total Amount: ₨ ${(trip.totalAmount || trip.price?.replace('₨', '') * trip.seats || 0).toLocaleString()}
Payment Method: ${trip.paymentMethod || 'Cash'}
Transaction ID: ${trip.transactionId || 'N/A'}

----------------------------------------
SPECIAL REQUESTS
----------------------------------------
${trip.specialRequests || 'None'}

----------------------------------------
IMPORTANT INSTRUCTIONS
----------------------------------------
1. Thank you for traveling with BusTracker Pakistan
2. Rate your experience on our app
3. Get 10% off on your next booking
4. For support: 0311-1234567

Thank you for choosing BusTracker Pakistan!
========================================
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Trip_Receipt_${trip.bookingId || trip.id}_${trip.date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    if (onDownloadTicket) onDownloadTicket(trip);
  };

  const printReceipt = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Trip Receipt - ${trip.busName || trip.bus}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background: #f5f5f5; }
            .receipt { max-width: 800px; margin: 0 auto; background: white; border: 3px solid #f97316; padding: 30px; border-radius: 15px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #f97316; padding-bottom: 20px; }
            .header h1 { color: #f97316; font-size: 28px; margin-bottom: 10px; }
            .status { text-align: center; margin: 20px 0; padding: 10px; border-radius: 8px; font-weight: bold; }
            .status-completed { background: #d1fae5; color: #059669; }
            .status-confirmed { background: #d1fae5; color: #059669; }
            .status-cancelled { background: #fee2e2; color: #dc2626; }
            .section { margin: 20px 0; padding: 15px; background: #f9fafb; border-radius: 10px; }
            .section h3 { color: #f97316; margin-bottom: 15px; border-left: 4px solid #f97316; padding-left: 10px; }
            .row { display: flex; justify-content: space-between; margin: 8px 0; padding: 5px 0; }
            .label { font-weight: bold; color: #4b5563; }
            .value { color: #1f2937; }
            .total { font-size: 20px; font-weight: bold; color: #f97316; margin-top: 20px; padding-top: 15px; border-top: 2px solid #e5e7eb; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h1>🚌 BUS TRACKER PAKISTAN</h1>
              <p>Official Trip Receipt</p>
            </div>
            <div class="status status-${trip.status || 'completed'}">
              Status: ${(trip.status || 'COMPLETED').toUpperCase()}
            </div>
            <div class="section">
              <h3>📋 Trip Information</h3>
              <div class="row"><span class="label">Booking ID:</span><span class="value">${trip.bookingId || `TRIP-${trip.id}`}</span></div>
              <div class="row"><span class="label">Date:</span><span class="value">${trip.date}</span></div>
            </div>
            <div class="section">
              <h3>🚍 Tour Details</h3>
              <div class="row"><span class="label">Tour:</span><span class="value">${trip.busName || trip.bus}</span></div>
              <div class="row"><span class="label">Type:</span><span class="value">${trip.type || 'Standard Tour'}</span></div>
              <div class="row"><span class="label">Route:</span><span class="value">${trip.from} → ${trip.to}</span></div>
              <div class="row"><span class="label">Time:</span><span class="value">${trip.time}</span></div>
            </div>
            <div class="section">
              <h3>👤 Customer Information</h3>
              <div class="row"><span class="label">Name:</span><span class="value">${trip.customerName || 'Guest User'}</span></div>
              <div class="row"><span class="label">Email:</span><span class="value">${trip.email || 'N/A'}</span></div>
              <div class="row"><span class="label">Phone:</span><span class="value">${trip.phone || 'N/A'}</span></div>
            </div>
            <div class="section">
              <h3>💰 Payment Details</h3>
              <div class="row"><span class="label">Seats:</span><span class="value">${trip.seats}</span></div>
              <div class="row"><span class="label">Payment Method:</span><span class="value">${trip.paymentMethod || 'Cash'}</span></div>
              <div class="total">Total Paid: ₨ ${(trip.totalAmount || 0).toLocaleString()}</div>
            </div>
            <div class="footer">
              <p>Thank you for choosing BusTracker Pakistan!</p>
              <p>For support: support@bustracker.pk | 0311-1234567</p>
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const DetailModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-800 sticky top-0 bg-gray-900">
          <h2 className="text-xl font-bold text-orange-500">Trip Details</h2>
          <button onClick={() => setShowDetails(false)} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          {/* Status Badge */}
          <div className="mb-4 flex justify-center">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(trip.status || 'completed')}`}>
              {trip.status?.toUpperCase() || 'COMPLETED'}
            </span>
          </div>

          {/* Trip Information */}
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-orange-500 font-bold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Route Information
              </h3>
              <div className="space-y-2">
                <p className="text-white"><span className="text-gray-400">From:</span> {trip.from}</p>
                <p className="text-white"><span className="text-gray-400">To:</span> {trip.to}</p>
                <p className="text-white"><span className="text-gray-400">Tour:</span> {trip.busName || trip.bus}</p>
                <p className="text-white"><span className="text-gray-400">Type:</span> {trip.type || 'Standard Tour'}</p>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-orange-500 font-bold mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date & Time
              </h3>
              <div className="space-y-2">
                <p className="text-white"><span className="text-gray-400">Date:</span> {trip.date}</p>
                <p className="text-white"><span className="text-gray-400">Time:</span> {trip.time}</p>
                <p className="text-white"><span className="text-gray-400">Duration:</span> {trip.duration || 'N/A'}</p>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-orange-500 font-bold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Booking Details
              </h3>
              <div className="space-y-2">
                <p className="text-white"><span className="text-gray-400">Seats Booked:</span> {trip.seats}</p>
                <p className="text-white"><span className="text-gray-400">Booking ID:</span> <span className="font-mono text-orange-400">{trip.bookingId || `TRIP-${trip.id}`}</span></p>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-orange-500 font-bold mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer Information
              </h3>
              <div className="space-y-2">
                <p className="text-white"><span className="text-gray-400">Name:</span> {trip.customerName || 'Guest User'}</p>
                <p className="text-white"><span className="text-gray-400">Email:</span> {trip.email || 'N/A'}</p>
                <p className="text-white"><span className="text-gray-400">Phone:</span> {trip.phone || 'N/A'}</p>
                <p className="text-white"><span className="text-gray-400">CNIC:</span> {trip.cnic || 'N/A'}</p>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-orange-500 font-bold mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Information
              </h3>
              <div className="space-y-2">
                <p className="text-white"><span className="text-gray-400">Total Amount:</span> 
                  <span className="text-orange-500 font-bold ml-2">₨ {(trip.totalAmount || 0).toLocaleString()}</span>
                </p>
                <p className="text-white"><span className="text-gray-400">Payment Method:</span> {trip.paymentMethod || 'Cash'}</p>
                <p className="text-white"><span className="text-gray-400">Transaction ID:</span> {trip.transactionId || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={downloadDetailedReceipt}
              className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Receipt
            </button>
            <button
              onClick={printReceipt}
              className="flex-1 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="border border-gray-800 rounded-lg p-4 mb-4 bg-black hover:border-orange-500 transition-all duration-300 hover:shadow-lg">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-semibold text-white">{trip.from}</span>
              <span className="text-orange-500">→</span>
              <span className="font-semibold text-white">{trip.to}</span>
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusBadge(trip.status || 'completed')}`}>
                {trip.status?.toUpperCase() || 'COMPLETED'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm mt-3">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="h-3 w-3 text-orange-500" />
                <span>{trip.date}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="h-3 w-3 text-orange-500" />
                <span>{trip.time}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="h-3 w-3 text-orange-500" />
                <span>{trip.seats} seat{trip.seats > 1 ? 's' : ''}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {trip.busName || trip.bus} • {trip.type || 'Standard Tour'}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <CreditCard className="h-3 w-3 text-green-500" />
              <p className="text-sm text-green-500 font-semibold">
                Total Paid: ₨ {(trip.totalAmount || 0).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowDetails(true)}
              className="flex items-center gap-2 px-3 py-2 text-orange-500 hover:bg-orange-500/10 rounded-lg transition border border-orange-500/30 hover:border-orange-500"
            >
              <Eye className="h-4 w-4" />
              <span className="text-sm hidden sm:inline">Details</span>
            </button>
            <button 
              onClick={downloadDetailedReceipt}
              className="flex items-center gap-2 px-3 py-2 text-orange-500 hover:bg-orange-500/10 rounded-lg transition border border-orange-500/30 hover:border-orange-500"
            >
              <Download className="h-4 w-4" />
              <span className="text-sm hidden sm:inline">Receipt</span>
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetails && <DetailModal />}
    </>
  );
};

export default PastTripCard;