const StatsCard = ({ title, value, icon: Icon, color, change }) => {
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-orange-500/30 transition">
      <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-gray-400 text-sm">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{change}</p>
    </div>
  );
};

export default StatsCard;