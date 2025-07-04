import { Gauge, Fuel, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

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
                <div className="flex items-center gap-1"><Gauge size={16} className="text-indigo-500" /> Odo: {log.odoReading} km</div>
                <div className="flex items-center gap-1"><Fuel size={16} className="text-green-600" /> Fuel: {log.fuelLitres} L</div>
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
                <Button
                  title="Edit"
                  className="mb-1 flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1"
                  onClick={() => onEdit && onEdit(log)}
                >
                  <Edit size={16} /> Edit
                </Button>
                <Button
                  title="Delete"
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1"
                  onClick={() => onDelete && onDelete(log)}
                >
                  <Trash2 size={16} /> Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FuelLogList;
