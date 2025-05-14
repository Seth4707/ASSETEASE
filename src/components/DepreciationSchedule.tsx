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
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Depreciation Schedule: {assetName}</h3>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Depreciation (₦)
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Accumulated (₦)
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book Value (₦)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schedule.map((entry) => (
                <tr key={entry.year} className={entry.year === 0 ? 'bg-blue-50' : ''}>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    {entry.year === 0 ? 'Purchase' : entry.year}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    {entry.year === 0 ? '-' : `₦${entry.depreciation.toLocaleString()}`}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    {entry.year === 0 ? '-' : `₦${entry.accumulated.toLocaleString()}`}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    ₦{entry.bookValue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


