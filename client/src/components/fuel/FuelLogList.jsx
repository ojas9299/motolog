const FuelLogList = ({ logs = [] }) => {
  return (
    <div>
      <h2 className="font-semibold mb-2">Previous Fuel Logs</h2>
      {logs.length === 0 ? (
        <p>No logs yet.</p>
      ) : (
        <ul className="space-y-2">
          {logs.map((log) => (
            <li key={log._id} className="border p-2 rounded">
              <div>🧭 Odo: {log.odoReading} km</div>
              <div>⛽ Fuel: {log.fuelLitres} L</div>
              <div className="text-sm text-gray-500">
                {new Date(log.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FuelLogList;
