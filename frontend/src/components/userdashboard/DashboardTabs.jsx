const DashboardTabs = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="border-b border-gray-800">
      <nav className="flex space-x-8 px-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition ${
              activeTab === tab
                ? "border-orange-500 text-orange-500"
                : "border-transparent text-gray-400 hover:text-orange-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default DashboardTabs;