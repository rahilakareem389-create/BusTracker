// components/userdashboard/UpcomingTripsSection.jsx
import TripCard from "./TripCard";

const UpcomingTripsSection = ({ trips, onViewDetails, onCancel }) => {
  if (!trips || trips.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg className="h-16 w-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-400 mb-2">No Upcoming Trips</h3>
          <p className="text-sm text-gray-500">Book a tour to see your upcoming adventures here</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Upcoming Trips</h3>
        <span className="text-xs text-gray-500">{trips.length} upcoming {trips.length === 1 ? 'trip' : 'trips'}</span>
      </div>
      <div className="space-y-4">
        {trips.map((trip, index) => (
          <TripCard 
            key={trip.bookingId || trip.id || `trip-${index}`} 
            trip={trip} 
            onViewDetails={onViewDetails}
            onCancel={onCancel}
            showActions={true}
          />
        ))}
      </div>
    </div>
  );
};

export default UpcomingTripsSection;