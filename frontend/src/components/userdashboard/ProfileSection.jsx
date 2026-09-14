// components/dashboard/ProfileSection.jsx
import { User, Mail, Phone, IdCard, MapPin, Award, Clock, TrendingUp, Calendar, Star } from "lucide-react";
import { useState } from "react";

const ProfileSection = ({ user, stats }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "Guest User",
    email: user?.email || "guest@example.com",
    phone: user?.phone || "Not provided",
    cnic: user?.cnic || "Not provided",
    address: user?.address || "Not provided"
  });

  const handleSave = () => {
    localStorage.setItem('user', JSON.stringify(profileData));
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const memberSince = new Date().toLocaleDateString('en-PK', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-500 to-orange-700 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg">
          {profileData.name.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-2xl font-bold text-white">{profileData.name}</h2>
        <p className="text-gray-400">Member since {memberSince}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-gray-900 to-black p-4 rounded-lg text-center border border-gray-800 hover:border-orange-500 transition">
          <Award className="h-8 w-8 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{stats.totalTrips}</p>
          <p className="text-sm text-gray-400">Total Trips</p>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-black p-4 rounded-lg text-center border border-gray-800 hover:border-orange-500 transition">
          <TrendingUp className="h-8 w-8 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">₨ {stats.totalSpent.toLocaleString()}</p>
          <p className="text-sm text-gray-400">Total Spent</p>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-black p-4 rounded-lg text-center border border-gray-800 hover:border-orange-500 transition">
          <Star className="h-8 w-8 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{stats.rewardPoints}</p>
          <p className="text-sm text-gray-400">Reward Points</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Personal Information</h3>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Save Changes
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-black rounded-lg">
            <User className="h-5 w-5 text-orange-500" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Full Name</p>
              {isEditing ? (
                <input 
                  type="text" 
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="bg-gray-800 text-white px-3 py-1 rounded w-full mt-1 focus:outline-none focus:border-orange-500"
                />
              ) : (
                <p className="text-white">{profileData.name}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-black rounded-lg">
            <Mail className="h-5 w-5 text-orange-500" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Email Address</p>
              {isEditing ? (
                <input 
                  type="email" 
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="bg-gray-800 text-white px-3 py-1 rounded w-full mt-1 focus:outline-none focus:border-orange-500"
                />
              ) : (
                <p className="text-white">{profileData.email}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-black rounded-lg">
            <Phone className="h-5 w-5 text-orange-500" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Phone Number</p>
              {isEditing ? (
                <input 
                  type="tel" 
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="bg-gray-800 text-white px-3 py-1 rounded w-full mt-1 focus:outline-none focus:border-orange-500"
                />
              ) : (
                <p className="text-white">{profileData.phone}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-black rounded-lg">
            <IdCard className="h-5 w-5 text-orange-500" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">CNIC Number</p>
              {isEditing ? (
                <input 
                  type="text" 
                  value={profileData.cnic}
                  onChange={(e) => setProfileData({...profileData, cnic: e.target.value})}
                  className="bg-gray-800 text-white px-3 py-1 rounded w-full mt-1 focus:outline-none focus:border-orange-500"
                />
              ) : (
                <p className="text-white">{profileData.cnic}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-black rounded-lg">
            <MapPin className="h-5 w-5 text-orange-500" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Address</p>
              {isEditing ? (
                <textarea 
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  className="bg-gray-800 text-white px-3 py-1 rounded w-full mt-1 focus:outline-none focus:border-orange-500"
                  rows="2"
                />
              ) : (
                <p className="text-white">{profileData.address}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;