import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ScheduleEntry } from '../utils/depreciation';

type ChartProps = {
  schedule: ScheduleEntry[];
  type: 'depreciation' | 'bookValue';
};

export function Chart({ schedule, type }: ChartProps) {
  // Skip the first entry (year 0) for better visualization
  const displaySchedule = schedule.filter(entry => entry.year > 0);
  
  if (displaySchedule.length === 0) {
    return <div className="bg-white p-4 rounded-lg shadow">No data to display</div>;
  }
  
  // Format data for recharts
  const chartData = displaySchedule.map(entry => ({
    year: `Year ${entry.year}`,
    value: type === 'depreciation' ? entry.depreciation : entry.bookValue
  }));
  
  const title = type === 'depreciation' ? 'Annual Depreciation' : 'Book Value Over Time';
  const barColor = type === 'depreciation' ? '#3b82f6' : '#10b981'; // blue-500 or green-500
  
  // Format the tooltip value
  const formatTooltipValue = (value: number) => `₦${value.toLocaleString()}`;
  
  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">{title}</h3>
      <div className="h-48 sm:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={50}
              interval={0}
              // On small screens, show fewer labels
              tickFormatter={(value, index) => {
                // On small screens, only show every other year label
                if (window.innerWidth < 640 && index % 2 !== 0) {
                  return '';
                }
                return value;
              }}
            />
            <YAxis 
              tickFormatter={(value) => `₦${value.toLocaleString()}`}
              width={60}
              tick={{ fontSize: 10 }}
            />
            <Tooltip formatter={formatTooltipValue} />
            <Bar dataKey="value" fill={barColor} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}



