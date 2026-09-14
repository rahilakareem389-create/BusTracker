// components/userdashboard/TripCard.jsx
import { useState } from "react";
import { MapPin, Calendar, Clock, Users, Eye, X } from "lucide-react";

const TripCard = ({ trip, onViewDetails, onCancel, showActions = true }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: "bg-green-600 text-white",
      pending: "bg-yellow-600 text-white",
      completed: "bg-blue-600 text-white",
      cancelled: "bg-red-600 text-white"
    };
    return styles[status] || styles.pending;
  };

  const StatusModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-orange-500">Trip Details</h2>
          <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <p><span className="text-gray-400">From:</span> <span className="text-white">{trip.from}</span></p>
            <p><span className="text-gray-400">To:</span> <span className="text-white">{trip.to}</span></p>
            <p><span className="text-gray-400">Date:</span> <span className="text-white">{trip.date}</span></p>
            <p><span className="text-gray-400">Time:</span> <span className="text-white">{trip.time}</span></p>
            <p><span className="text-gray-400">Bus:</span> <span className="text-white">{trip.busName || trip.bus}</span></p>
            <p><span className="text-gray-400">Seats:</span> <span className="text-white">{trip.seats}</span></p>
            <p><span className="text-gray-400">Status:</span> <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(trip.status)}`}>{trip.status?.toUpperCase() || 'PENDING'}</span></p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="border border-gray-800 rounded-lg p-4 hover:border-orange-500 transition bg-black">
        <div className="flex flex-wrap justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3 flex-wrap">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span className="font-semibold text-white">{trip.from}</span>
                <span className="text-orange-500">→</span>
                <span className="font-semibold text-white">{trip.to}</span>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(trip.status)}`}>
                {trip.status?.toUpperCase() || 'PENDING'}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-medium text-gray-300 flex items-center gap-1"><Calendar className="h-3 w-3" /> {trip.date}</p>
              </div>
              <div>
                <p className="text-gray-500">Time</p>
                <p className="font-medium text-gray-300 flex items-center gap-1"><Clock className="h-3 w-3" /> {trip.time}</p>
              </div>
              <div>
                <p className="text-gray-500">Bus</p>
                <p className="font-medium text-gray-300">{trip.busName || trip.bus}</p>
              </div>
              <div>
                <p className="text-gray-500">Seats</p>
                <p className="font-medium text-gray-300 flex items-center gap-1"><Users className="h-3 w-3" /> {trip.seats}</p>
              </div>
            </div>
          </div>
          {showActions && (
            <div className="flex gap-2 mt-3 md:mt-0">
              <button 
                onClick={() => setShowDetailModal(true)}
                className="px-4 py-2 text-sm bg-gray-800 text-orange-500 rounded-lg hover:bg-gray-700 transition border border-orange-500/30"
              >
                <Eye className="h-4 w-4 inline mr-1" />
                Details
              </button>
              <button 
                onClick={() => onCancel?.(trip)}
                className="px-4 py-2 text-sm border border-red-500 text-red-500 rounded-lg hover:bg-red-500/10 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
      {showDetailModal && <StatusModal />}
    </>
  );
};

export default TripCard;