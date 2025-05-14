import { useState } from 'react';
import { useAssets } from '../context/AssetContext';
import type { Asset } from '../types/asset';
import { AssetDetailModal } from './AssetDetailModal';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export function AssetRegister() {
  const { assets, deleteAsset } = useAssets();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [filterType, setFilterType] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showModal, setShowModal] = useState(false);

  // Get unique asset types for filter dropdown
  const assetTypes = Array.from(new Set(assets.map(asset => asset.assetType)));

  // Filter assets by type
  const filteredAssets = filterType 
    ? assets.filter(asset => asset.assetType === filterType) 
    : assets;

  // Sort assets
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.assetName.localeCompare(b.assetName);
        break;
      case 'type':
        comparison = a.assetType.localeCompare(b.assetType);
        break;
      case 'cost':
        comparison = a.purchaseCost - b.purchaseCost;
        break;
      case 'date':
        comparison = new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime();
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Calculate current year's depreciation and NBV for each asset
  const getCurrentYearData = (asset: Asset) => {
    const purchaseYear = new Date(asset.purchaseDate).getFullYear();
    const currentYear = new Date().getFullYear();
    const yearsSincePurchase = currentYear - purchaseYear;
    
    // Get the appropriate year from the schedule
    const yearData = asset.schedule.find(entry => entry.year === yearsSincePurchase);
    
    return {
      depreciation: yearData?.depreciation || 0,
      nbv: yearData?.bookValue || asset.purchaseCost
    };
  };

  const handleViewDetails = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowModal(true);
  };

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ['Asset Name', 'Type', 'Purchase Cost', 'Purchase Date', 'Useful Life', 'Method', 'Current NBV'];
    const csvRows = [
      headers.join(','),
      ...sortedAssets.map(asset => {
        const { nbv } = getCurrentYearData(asset);
        return [
          asset.assetName,
          asset.assetType,
          asset.purchaseCost.toFixed(2),
          asset.purchaseDate,
          asset.usefulLife,
          asset.method,
          nbv.toFixed(2)
        ].join(',');
      })
    ];
    
    // Create and download the CSV file
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'asset_register.csv');
    link.click();
  };

  const handleExportPDF = () => {
    // @ts-ignore - jsPDF types are not fully compatible with TypeScript
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Asset Register', 14, 20);
    
    // Add generation date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Prepare table data
    const tableColumn = ['Asset Name', 'Type', 'Purchase Cost (₦)', 'Purchase Date', 'Useful Life', 'Method', 'Current NBV (₦)'];
    const tableRows = sortedAssets.map(asset => {
      const { nbv } = getCurrentYearData(asset);
      return [
        asset.assetName,
        asset.assetType,
        asset.purchaseCost.toFixed(2),
        asset.purchaseDate,
        asset.usefulLife.toString(),
        asset.method,
        nbv.toFixed(2)
      ];
    });
    
    // @ts-ignore - autoTable is added by jspdf-autotable
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    // Save the PDF
    doc.save('asset_register.pdf');
  };

  // Add sorting functionality
  const handleSort = (column: string) => {
    if (sortBy === column) {
      // If already sorting by this column, toggle order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, set it and default to ascending
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <h2 className="text-xl font-bold">Asset Register</h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-auto">
            <label className="block sm:inline mr-2 text-sm">Filter by Type:</label>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full sm:w-auto border rounded p-1 text-sm"
            >
              <option value="">All Types</option>
              {assetTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleExportCSV}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Export CSV
            </button>
            <button 
              onClick={handleExportPDF}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm"
            >
              Export PDF
            </button>
          </div>
        </div>
      </div>
      
      {assets.length === 0 ? (
        <p className="text-center text-gray-500 my-8">No assets added yet. Use the calculator to add assets.</p>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Asset Name
                    {sortBy === 'name' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('type')}
                  >
                    Type
                    {sortBy === 'type' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('cost')}
                  >
                    Purchase Cost
                    {sortBy === 'cost' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    Purchase Date
                    {sortBy === 'date' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="py-3 px-6 text-center">Method</th>
                  <th className="py-3 px-6 text-right">Current Depreciation</th>
                  <th className="py-3 px-6 text-right">Current NBV</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {sortedAssets.map(asset => {
                  const { depreciation, nbv } = getCurrentYearData(asset);
                  return (
                    <tr key={asset.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6 text-left">{asset.assetName}</td>
                      <td className="py-3 px-6 text-left">{asset.assetType}</td>
                      <td className="py-3 px-6 text-right">₦{asset.purchaseCost.toLocaleString()}</td>
                      <td className="py-3 px-6 text-center">{asset.purchaseDate}</td>
                      <td className="py-3 px-6 text-center">{asset.method}</td>
                      <td className="py-3 px-6 text-right">₦{depreciation.toLocaleString()}</td>
                      <td className="py-3 px-6 text-right">₦{nbv.toLocaleString()}</td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex justify-center items-center space-x-2">
                          <button 
                            onClick={() => handleViewDetails(asset)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => deleteAsset(asset.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {showModal && selectedAsset && (
        <AssetDetailModal 
          asset={selectedAsset} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
}





