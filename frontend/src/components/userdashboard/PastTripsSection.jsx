// components/userdashboard/PastTripsSection.jsx
import PastTripCard from "./PastTripCard";

const PastTripsSection = ({ trips, onDownloadTicket }) => {
  if (!trips || trips.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg className="h-16 w-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-400 mb-2">No Past Trips</h3>
          <p className="text-sm text-gray-500">Your completed trips will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Past Trips</h3>
        <span className="text-xs text-gray-500">{trips.length} completed {trips.length === 1 ? 'trip' : 'trips'}</span>
      </div>
      <div className="space-y-4">
        {trips.map((trip, index) => (
          <PastTripCard 
            key={trip.bookingId || trip.id || `past-trip-${index}`} 
            trip={trip} 
            onDownloadTicket={onDownloadTicket}
          />
        ))}
      </div>
    </div>
  );
};

export default PastTripsSection;