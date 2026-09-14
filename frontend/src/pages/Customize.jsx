import { useState } from "react";
import { jsPDF } from "jspdf";
import { Link } from "react-router-dom";
import { 
  FaSave, 
  FaFolderOpen, 
  FaFilePdf, 
  FaTachometerAlt,
  FaPalette,
  FaBus,
  FaWifi,
  FaSnowflake,
  FaUsb,
  FaCoffee,
  FaTv,
  FaToilet,
  FaMedkit,
  FaUtensils,
  FaBolt,
  FaMapMarkedAlt,
  FaVideo,
  FaMusic,
  FaLightbulb,
  FaSuitcase,
  FaCheckCircle,
  FaStar,
  FaUsers,
  FaCity,
  FaBed,
  FaBriefcase,
  FaLeaf,
  FaGlassCheers,
  FaAngleDoubleRight,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";

export default function Customize() {
  const [config, setConfig] = useState({
    color: "black",
    style: "standard",
    amenities: [],
  });

  const [saved, setSaved] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  
  // Dropdown states
  const [openDropdowns, setOpenDropdowns] = useState({
    color: true,
    style: false,
    amenities: false
  });

  const toggleDropdown = (section) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // All available colors
  const colors = [
    "Black", "Blue", "White", "Gold", "Red", 
    "Green", "Purple", "Orange", "Silver", "Navy Blue",
    "Maroon", "Cyan", "Lime", "Pink", "Brown"
  ];

  // All available styles with icons and descriptions
  const styles = [
    { name: "Standard", icon: <FaBus />, desc: "💰 Budget friendly", price: "$30" },
    { name: "Luxury", icon: <FaStar />, desc: "⭐ Premium experience", price: "$50" },
    { name: "Mini Bus", icon: <FaUsers />, desc: "👥 Perfect for small groups", price: "$40" },
    { name: "Double Decker", icon: <FaCity />, desc: "🏙️ Panoramic views", price: "$70" },
    { name: "Sleeper", icon: <FaBed />, desc: "😴 Comfortable sleep", price: "$80" },
    { name: "Executive", icon: <FaBriefcase />, desc: "💼 Business class", price: "$65" },
    { name: "School Bus", icon: <FaUsers />, desc: "📚 Educational tours", price: "$35" },
    { name: "Coach", icon: <FaBus />, desc: "🏆 Long distance comfort", price: "$55" },
    { name: "Electric Bus", icon: <FaLeaf />, desc: "🔋 Eco-friendly", price: "$75" },
    { name: "Party Bus", icon: <FaGlassCheers />, desc: "🎉 Entertainment focused", price: "$90" }
  ];

  // All available amenities with icons
  const amenitiesList = [
    { name: "WiFi", icon: <FaWifi />, desc: "High-speed internet" },
    { name: "AC", icon: <FaSnowflake />, desc: "Air conditioning" },
    { name: "USB Charging", icon: <FaUsb />, desc: "Charging ports" },
    { name: "Refreshments", icon: <FaCoffee />, desc: "Snacks & drinks" },
    { name: "Entertainment System", icon: <FaTv />, desc: "LCD screens" },
    { name: "Restroom", icon: <FaToilet />, desc: "Washroom on board" },
    { name: "First Aid Kit", icon: <FaMedkit />, desc: "Medical kit" },
    { name: "Reclining Seats", icon: <FaBed />, desc: "Adjustable seats" },
    { name: "Meal Service", icon: <FaUtensils />, desc: "Hot meals" },
    { name: "Fast Charging", icon: <FaBolt />, desc: "Quick charge ports" },
    { name: "GPS Tracking", icon: <FaMapMarkedAlt />, desc: "Real-time location" },
    { name: "Security Cameras", icon: <FaVideo />, desc: "24/7 monitoring" },
    { name: "Music System", icon: <FaMusic />, desc: "Entertainment" },
    { name: "Reading Lights", icon: <FaLightbulb />, desc: "Personal lights" },
    { name: "Luggage Storage", icon: <FaSuitcase />, desc: "Extra space" }
  ];

  const toggleAmenity = (amenityName) => {
    setConfig((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityName)
        ? prev.amenities.filter((a) => a !== amenityName)
        : [...prev.amenities, amenityName],
    }));
  };

  // ✅ SAVE FUNCTION
  const saveConfig = () => {
    localStorage.setItem("busConfig", JSON.stringify(config));
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  // ✅ LOAD SAVED DATA
  const loadConfig = () => {
    const data = localStorage.getItem("busConfig");
    if (data) {
      setConfig(JSON.parse(data));
    }
  };

  // ✅ DOWNLOAD CONFIGURATION AS PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(255, 165, 0);
    doc.text("Bus Configuration Details", 20, 20);
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const date = new Date().toLocaleString();
    doc.text(`Generated on: ${date}`, 20, 30);
    
    // Add line
    doc.setDrawColor(255, 165, 0);
    doc.line(20, 35, 190, 35);
    
    // Color section
    doc.setFontSize(14);
    doc.setTextColor(255, 165, 0);
    doc.text("Bus Color", 20, 50);
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`Selected Color: ${config.color.toUpperCase()}`, 30, 60);
    
    // Style section
    doc.setFontSize(14);
    doc.setTextColor(255, 165, 0);
    doc.text("Bus Style", 20, 80);
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`Selected Style: ${config.style.toUpperCase()}`, 30, 90);
    
    // Amenities section
    doc.setFontSize(14);
    doc.setTextColor(255, 165, 0);
    doc.text("Selected Amenities", 20, 110);
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    
    let yPos = 120;
    if (config.amenities.length > 0) {
      config.amenities.forEach((amenity, index) => {
        doc.text(`✓ ${amenity}`, 30, yPos);
        yPos += 8;
      });
    } else {
      doc.text("No amenities selected", 30, yPos);
      yPos += 8;
    }
    
    // Summary section
    doc.setFontSize(14);
    doc.setTextColor(255, 165, 0);
    doc.text("Summary", 20, yPos + 10);
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`Total Amenities Selected: ${config.amenities.length}`, 30, yPos + 25);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for choosing our bus service!", 20, 280);
    doc.text("Visit us again for more customization options", 20, 288);
    
    // Save PDF
    doc.save(`bus-configuration-${Date.now()}.pdf`);
    
    setDownloaded(true);
    setTimeout(() => {
      setDownloaded(false);
    }, 3000);
  };

  // Get color preview style
  const getColorPreview = (color) => {
    const colorMap = {
      "Black": "#000000",
      "Blue": "#3B82F6",
      "White": "#FFFFFF",
      "Gold": "#FBBF24",
      "Red": "#EF4444",
      "Green": "#10B981",
      "Purple": "#8B5CF6",
      "Orange": "#F97316",
      "Silver": "#9CA3AF",
      "Navy Blue": "#1E3A8A",
      "Maroon": "#800000",
      "Cyan": "#06B6D4",
      "Lime": "#84CC16",
      "Pink": "#EC4899",
      "Brown": "#78350F"
    };
    return colorMap[color] || "#000000";
  };

  return (
    <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        {/* TITLE */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-full mb-4">
            <FaBus className="text-5xl text-orange-400" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
            Customize Your Bus
          </h1>
          <p className="text-gray-400 mt-2">Create your perfect travel experience</p>
        </div>

        {/* SUCCESS MESSAGES */}
        {saved && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-center text-green-400 font-semibold animate-pulse">
            <FaCheckCircle className="inline mr-2" />
            Configuration Saved Successfully!
          </div>
        )}

        {downloaded && (
          <div className="mb-4 p-4 bg-blue-500/20 border border-blue-500 rounded-lg text-center text-blue-400 font-semibold animate-pulse">
            <FaFilePdf className="inline mr-2" />
            PDF Downloaded Successfully!
          </div>
        )}

        {/* COLOR DROPDOWN */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl mb-4 overflow-hidden">
          <button
            onClick={() => toggleDropdown('color')}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-800/50 transition-all duration-300"
          >
            <h2 className="text-2xl font-bold flex items-center gap-2 text-orange-400">
              <FaPalette /> Bus Color ({colors.length} options)
            </h2>
            {openDropdowns.color ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          
          {openDropdowns.color && (
            <div className="p-6 pt-0 border-t border-gray-800">
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setConfig({ ...config, color: color.toLowerCase() })}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 font-semibold text-sm ${
                      config.color === color.toLowerCase()
                        ? "border-orange-400 scale-105 shadow-lg shadow-orange-500/30"
                        : "border-gray-700 hover:border-gray-500 hover:scale-105"
                    }`}
                    style={{
                      backgroundColor: getColorPreview(color),
                      color: ["White", "Gold", "Silver"].includes(color) ? "#000" : "#fff"
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* STYLE DROPDOWN */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl mb-4 overflow-hidden">
          <button
            onClick={() => toggleDropdown('style')}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-800/50 transition-all duration-300"
          >
            <h2 className="text-2xl font-bold flex items-center gap-2 text-orange-400">
              <FaBus /> Bus Style ({styles.length} options)
            </h2>
            {openDropdowns.style ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          
          {openDropdowns.style && (
            <div className="p-6 pt-0 border-t border-gray-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {styles.map((style) => (
                  <button
                    key={style.name}
                    onClick={() => setConfig({ ...config, style: style.name.toLowerCase() })}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      config.style === style.name.toLowerCase()
                        ? "border-orange-400 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 shadow-lg shadow-orange-500/20"
                        : "border-gray-700 hover:border-gray-500 hover:bg-gray-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl text-orange-400">{style.icon}</span>
                      <span className="font-semibold text-lg">{style.name}</span>
                    </div>
                    <div className="text-xs text-gray-400">{style.desc}</div>
                    <div className="text-sm text-orange-400 mt-1 font-semibold">{style.price}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AMENITIES DROPDOWN */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl mb-6 overflow-hidden">
          <button
            onClick={() => toggleDropdown('amenities')}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-800/50 transition-all duration-300"
          >
            <h2 className="text-2xl font-bold flex items-center gap-2 text-orange-400">
              <FaStar /> Amenities ({amenitiesList.length} options)
            </h2>
            {openDropdowns.amenities ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          
          {openDropdowns.amenities && (
            <div className="p-6 pt-0 border-t border-gray-800">
              <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar mt-4">
                {amenitiesList.map((amenity) => (
                  <label
                    key={amenity.name}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                      config.amenities.includes(amenity.name)
                        ? "border-orange-400 bg-gradient-to-r from-orange-500/10 to-yellow-500/10"
                        : "border-gray-700 hover:border-gray-500 hover:bg-gray-800/30"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={config.amenities.includes(amenity.name)}
                      onChange={() => toggleAmenity(amenity.name)}
                      className="w-5 h-5 accent-orange-400 cursor-pointer"
                    />
                    <span className="text-2xl text-orange-400">{amenity.icon}</span>
                    <span className="flex-1 font-medium">{amenity.name}</span>
                    <span className="text-xs text-gray-500 hidden md:block">{amenity.desc}</span>
                    {config.amenities.includes(amenity.name) && (
                      <FaCheckCircle className="text-orange-400 text-sm" />
                    )}
                  </label>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="text-sm text-gray-400 flex justify-between items-center">
                  <span>Selected Amenities</span>
                  <span className="text-orange-400 font-bold">{config.amenities.length} / {amenitiesList.length}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(config.amenities.length / amenitiesList.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PREVIEW SECTION */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-900/95 border border-gray-800 p-6 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-yellow-400">
            <FaCheckCircle /> Your Configuration Summary
          </h2>

          <div className="space-y-4 p-4 rounded-xl bg-black/50 border border-gray-800">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-800">
              <div 
                className="w-12 h-12 rounded-full border-2 border-orange-400 shadow-lg"
                style={{ backgroundColor: getColorPreview(config.color.charAt(0).toUpperCase() + config.color.slice(1)) }}
              ></div>
              <div>
                <p className="text-gray-400 text-sm">Selected Color</p>
                <p className="text-xl font-bold text-orange-400">
                  {config.color.toUpperCase()}
                </p>
              </div>
            </div>
            
            <div className="pb-3 border-b border-gray-800">
              <p className="text-gray-400 text-sm">Bus Style</p>
              <p className="text-xl font-bold text-white">
                {config.style.toUpperCase()}
              </p>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm mb-2">Selected Amenities</p>
              <div className="flex flex-wrap gap-2">
                {config.amenities.length > 0 ? (
                  config.amenities.map((amenity) => (
                    <span key={amenity} className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
                      {amenity}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 italic">No amenities selected</span>
                )}
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={saveConfig}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-black px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all font-semibold"
            >
              <FaSave /> Save Configuration
            </button>

            <button
              onClick={loadConfig}
              className="flex items-center gap-2 border-2 border-yellow-400 text-yellow-400 px-6 py-3 rounded-xl hover:bg-yellow-400 hover:text-black transition-all font-semibold"
            >
              <FaFolderOpen /> Load Saved
            </button>

            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 border-2 border-blue-400 text-blue-400 px-6 py-3 rounded-xl hover:bg-blue-400 hover:text-black transition-all font-semibold"
            >
              <FaFilePdf /> Download PDF
            </button>

            <Link
              to="/user-dashboard"
              className="flex items-center gap-2 border-2 border-purple-400 text-purple-400 px-6 py-3 rounded-xl hover:bg-purple-400 hover:text-black transition-all font-semibold text-center"
            >
              <FaTachometerAlt /> Dashboard <FaAngleDoubleRight />
            </Link>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f97316;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #fbbf24;
        }
      `}</style>
    </section>
  );
}