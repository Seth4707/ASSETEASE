import type { Asset } from '../types/asset';
import { Chart } from './Chart';

type AssetDetailModalProps = {
  asset: Asset;
  onClose: () => void;
};

export function AssetDetailModal({ asset, onClose }: AssetDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-3 sm:p-6">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-2xl font-bold">{asset.assetName}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 text-sm sm:text-base">
            {/* Asset details in a responsive grid */}
            <div>
              <p className="text-gray-500">Purchase Cost</p>
              <p className="font-semibold">₦{asset.purchaseCost.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Purchase Date</p>
              <p className="font-semibold">{asset.purchaseDate}</p>
            </div>
            <div>
              <p className="text-gray-500">Useful Life</p>
              <p className="font-semibold">{asset.usefulLife} years</p>
            </div>
            <div>
              <p className="text-gray-500">Method</p>
              <p className="font-semibold">
                {asset.method}
                {asset.method === 'Declining Balance' && asset.depreciationRate &&
                  <span className="text-xs sm:text-sm text-gray-600 ml-1">({asset.depreciationRate}%)</span>
                }
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <Chart schedule={asset.schedule} type="depreciation" />
            <Chart schedule={asset.schedule} type="bookValue" />
          </div>
          
          <h3 className="text-lg font-bold mb-2">Depreciation Schedule</h3>
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-center">Year</th>
                    <th className="py-3 px-6 text-right">Depreciation</th>
                    <th className="py-3 px-6 text-right">Accumulated Depreciation</th>
                    <th className="py-3 px-6 text-right">Book Value</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {asset.schedule.map(entry => (
                    <tr key={entry.year} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6 text-center">{entry.year}</td>
                      <td className="py-3 px-6 text-right">₦{entry.depreciation.toLocaleString()}</td>
                      <td className="py-3 px-6 text-right">₦{entry.accumulated.toLocaleString()}</td>
                      <td className="py-3 px-6 text-right">₦{entry.bookValue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}








