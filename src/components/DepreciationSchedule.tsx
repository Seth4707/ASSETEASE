import type { ScheduleEntry } from '../utils/depreciation';

type DepreciationScheduleProps = {
  schedule: ScheduleEntry[];
  assetName: string;
};

export function DepreciationSchedule({ schedule, assetName }: DepreciationScheduleProps) {
  if (!schedule.length) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Depreciation Schedule: {assetName}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Depreciation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accumulated</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Value</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schedule.map((entry, index) => (
              <tr key={entry.year} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">{entry.year}</td>
                <td className="px-6 py-4 whitespace-nowrap">₦{entry.depreciation.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">₦{entry.accumulated.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">₦{entry.bookValue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

