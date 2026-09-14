import { useState } from "react";
import { Star, MapPin, Clock, Users } from "lucide-react";

const BusCard = ({ bus, onBookNow, userRole = "user" }) => {
  const [isHovered, setIsHovered] = useState(false);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(<Star key={i} className={`h-3 w-3 ${i < rating ? 'fill-orange-500 text-orange-500' : 'text-gray-600'}`} />);
    }
    return stars;
  };

  return (
    <div className={`bg-gray-900 rounded-xl overflow-hidden border transition-all duration-300 ${
      isHovered ? 'border-orange-500/50 shadow-lg shadow-orange-500/10 transform -translate-y-1' : 'border-gray-800'
    }`}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}>
      <div className="relative h-48 overflow-hidden">
        <img src={bus.images?.[0] || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500"} alt={bus.name}
          className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 bg-orange-600 text-white px-2 py-1 rounded-lg text-sm font-bold">
          {bus.price}
        </div>
        <div className="absolute bottom-3 left-3 bg-black/80 px-2 py-1 rounded-lg flex items-center gap-1">
          {renderStars(bus.rating)}
          <span className="text-white text-xs ml-1">{bus.rating}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2">{bus.name}</h3>
        <p className="text-gray-400 text-xs mb-3 line-clamp-2">{bus.description}</p>
        
        <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
          <MapPin className="h-3 w-3 text-orange-500" />
          <span>{bus.from} → {bus.to}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Clock className="h-3 w-3 text-orange-500" />
            <span>{bus.time}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Users className="h-3 w-3 text-orange-500" />
            <span>{bus.seats} seats left</span>
          </div>
        </div>
        
        <button onClick={() => onBookNow && onBookNow(bus)}
          className="w-full py-2 rounded-lg font-semibold text-sm bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:shadow-lg">
          Book Now →
        </button>
      </div>
    </div>
  );
};

export default BusCard;