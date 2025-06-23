const FuelLogList = ({ logs = [], onEdit, onDelete }) => {
  return (
    <div>
      <h2 className="font-semibold mb-2">Previous Fuel Logs</h2>
      {logs.length === 0 ? (
        <p>No logs yet.</p>
      ) : (
        <ul className="space-y-2">
          {logs.map((log) => (
            <li key={log._id} className="border p-2 rounded flex items-center justify-between gap-2">
              <div>
                <div>🧭 Odo: {log.odoReading} km</div>
                <div>⛽ Fuel: {log.fuelLitres} L</div>
                <div>
                  {log.mileage !== null && log.mileage !== undefined
                    ? `Mileage: ${log.mileage.toFixed(2)} km/l`
                    : "Mileage: N/A"}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex flex-col gap-2 ml-2">
                <button
                  title="Edit"
                  className="text-blue-600 hover:text-blue-800 text-xl"
                  onClick={() => onEdit && onEdit(log)}
                >
                  ✏️
                </button>
                <button
                  title="Delete"
                  className="text-red-600 hover:text-red-800 text-xl"
                  onClick={() => onDelete && onDelete(log)}
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FuelLogList;
