type AssetSummaryProps = {
  assetName: string;
  assetType: string;
  purchaseCost: number;
  residualValue: number;
  method: string;
  usefulLife: number;
  currentYear: number;
  bookValue: number;
  depreciationRate?: number; // Add this optional prop
};

export function AssetSummary({
  assetName,
  assetType, // Keep this as it might be used elsewhere
  purchaseCost,
  residualValue,
  method,
  usefulLife,
  currentYear,
  bookValue,
  depreciationRate
}: AssetSummaryProps) {
  const yearsRemaining = Math.max(0, usefulLife - currentYear);
  
  // Use assetType in the component to avoid the unused variable warning
  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Asset Summary - Year {currentYear}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><span className="font-medium">Asset Name:</span> {assetName}</p>
          <p><span className="font-medium">Asset Type:</span> {assetType}</p>
          <p><span className="font-medium">Purchase Cost:</span> ₦{purchaseCost.toFixed(2)}</p>
          <p><span className="font-medium">Residual Value:</span> ₦{residualValue.toFixed(2)}</p>
        </div>
        <div>
          <p><span className="font-medium">Depreciation Method:</span> {method}</p>
          {depreciationRate && (
            <p><span className="font-medium">Depreciation Rate:</span> {depreciationRate}%</p>
          )}
          <p><span className="font-medium">Useful Life:</span> {usefulLife} years</p>
          <p><span className="font-medium">Years Remaining:</span> {yearsRemaining} years</p>
          <p><span className="font-medium">Current Book Value:</span> ₦{bookValue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}




