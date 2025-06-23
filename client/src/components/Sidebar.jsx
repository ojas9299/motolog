// components/Sidebar.jsx
const Sidebar = ({ setActiveTab, activeTab, children }) => {
  const tabs = ["vehicles", "trips", "fuel"];

  return (
    <div className="flex">
      <nav className="w-64 bg-gray-100 p-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`block w-full text-left px-4 py-2 rounded-lg ${
              activeTab === tab ? "bg-indigo-600 text-white" : "text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Sidebar;
