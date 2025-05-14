import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';

type AssetFormProps = {
  onCalculate: (assetData: AssetData) => void;
};

export type AssetData = {
  assetName: string;
  assetType: string;
  purchaseCost: number;
  residualValue: number;
  usefulLife: number;
  purchaseDate: string;
  method: 'Straight-Line' | 'Declining Balance';
  depreciationRate?: number; // Add this field
};

// Asset type definitions with suggested residual values
const assetTypes = [
  { value: '', label: 'Select Asset Type', residualRange: '' },
  { value: 'computers', label: 'Computers & IT Equipment', residualRange: '0-10%' },
  { value: 'vehicles', label: 'Motor Vehicles', residualRange: '10-20%' },
  { value: 'machinery', label: 'Plant & Machinery', residualRange: '5-15%' },
  { value: 'furniture', label: 'Office Furniture & Fittings', residualRange: '5-10%' },
  { value: 'buildings', label: 'Buildings (Commercial)', residualRange: '20-30%' },
  { value: 'tools', label: 'Tools & Equipment', residualRange: '5-10%' },
  { value: 'leasehold', label: 'Leasehold Improvements', residualRange: '0-5%' },
  { value: 'other', label: 'Other', residualRange: '' }
];

export function AssetForm({ onCalculate }: AssetFormProps) {
  const [formData, setFormData] = useState<AssetData>({
    assetName: '',
    assetType: '',
    purchaseCost: 0,
    residualValue: 0,
    usefulLife: 0,
    purchaseDate: '',
    method: 'Straight-Line',
    depreciationRate: 20, // Default rate of 20%
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof AssetData, string>>>({});
  const [showResidualTooltip, setShowResidualTooltip] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If asset type changes, suggest residual value, useful life, and depreciation rate
    if (name === 'assetType' && value) {
      if (formData.purchaseCost > 0) {
        suggestResidualValue(value, formData.purchaseCost);
      }
      suggestUsefulLife(value);
      suggestDepreciationRate(value);
    }
    
    // If method changes to Declining Balance, suggest depreciation rate based on asset type
    if (name === 'method' && value === 'Declining Balance' && formData.assetType) {
      suggestDepreciationRate(formData.assetType);
    }
  };
  
  // Suggest residual value based on asset type and purchase cost
  const suggestResidualValue = (assetType: string, cost: number) => {
    let percentage = 0;
    
    switch(assetType) {
      case 'computers':
        percentage = 0.05; // 5% (middle of 0-10%)
        break;
      case 'vehicles':
        percentage = 0.15; // 15% (middle of 10-20%)
        break;
      case 'machinery':
        percentage = 0.10; // 10% (middle of 5-15%)
        break;
      case 'furniture':
        percentage = 0.075; // 7.5% (middle of 5-10%)
        break;
      case 'buildings':
        percentage = 0.25; // 25% (middle of 20-30%)
        break;
      default:
        return; // Don't suggest for 'other' or empty selection
    }
    
    const suggestedValue = Math.round(cost * percentage);
    setFormData(prev => ({ ...prev, residualValue: suggestedValue }));
  };

  // Update residual value suggestion when purchase cost changes
  useEffect(() => {
    if (formData.assetType && formData.purchaseCost > 0) {
      suggestResidualValue(formData.assetType, formData.purchaseCost);
    }
  }, [formData.purchaseCost]);

  // Add this function to suggest depreciation rates based on asset type
  const suggestDepreciationRate = (assetType: string) => {
    let rate = 20; // Default rate
    
    switch(assetType) {
      case 'computers':
        rate = 35; // Middle of 30-40%
        break;
      case 'vehicles':
        rate = 22.5; // Middle of 20-25%
        break;
      case 'machinery':
        rate = 20; // Middle of 15-25%
        break;
      case 'furniture':
        rate = 12.5; // Middle of 10-15%
        break;
      case 'buildings':
        rate = 3.5; // Middle of 2-5%
        break;
      case 'tools':
        rate = 26.67; // Middle of 20-33.33%
        break;
      case 'leasehold':
        // For leasehold, we'd ideally use the lease term, but we'll default to 10%
        rate = 10;
        break;
      default:
        rate = 20; // Default rate
    }
    
    setFormData(prev => ({ ...prev, depreciationRate: rate }));
  };

  // Add this function to suggest useful life based on asset type
  const suggestUsefulLife = (assetType: string) => {
    let years = 5; // Default useful life
    
    switch(assetType) {
      case 'computers':
        years = 3; // Computers typically have 3-5 years useful life
        break;
      case 'vehicles':
        years = 5; // Vehicles typically have 5-8 years useful life
        break;
      case 'machinery':
        years = 10; // Machinery typically has 7-15 years useful life
        break;
      case 'furniture':
        years = 7; // Furniture typically has 7-10 years useful life
        break;
      case 'buildings':
        years = 30; // Buildings typically have 25-40 years useful life
        break;
      case 'tools':
        years = 5; // Tools typically have 3-7 years useful life
        break;
      case 'leasehold':
        years = 10; // Leasehold improvements typically match lease term
        break;
      default:
        years = 5; // Default useful life
    }
    
    setFormData(prev => ({ ...prev, usefulLife: years }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof AssetData, string>> = {};
    
    if (!formData.assetName.trim()) newErrors.assetName = 'Asset name is required';
    if (formData.purchaseCost <= 0) newErrors.purchaseCost = 'Purchase cost must be positive';
    if (formData.usefulLife <= 0) newErrors.usefulLife = 'Useful life must be positive';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onCalculate({
        ...formData,
        purchaseCost: Number(formData.purchaseCost),
        residualValue: formData.residualValue ? Number(formData.residualValue) : 0,
        usefulLife: Number(formData.usefulLife)
      });
    }
  };

  // Get the selected asset type's residual range
  const selectedAssetType = assetTypes.find(type => type.value === formData.assetType);
  const residualRange = selectedAssetType?.residualRange || '';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Asset Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Asset Name
            </label>
            <input
              type="text"
              name="assetName"
              value={formData.assetName}
              onChange={handleChange}
              placeholder="Office Computer"
              required
              className={`w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.assetName ? 'border-red-500' : ''
              }`}
            />
            {errors.assetName && (
              <p className="text-xs text-red-500 mt-1">{errors.assetName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Asset Type
            </label>
            <select
              name="assetType"
              value={formData.assetType}
              onChange={handleChange}
              required
              className={`w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.assetType ? 'border-red-500' : ''
              }`}
            >
              {assetTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            {errors.assetType && (
              <p className="text-xs text-red-500 mt-1">{errors.assetType}</p>
            )}
            {formData.assetType && (
              <p className="text-xs text-gray-500 mt-1">
                Suggested residual value: {residualRange}
              </p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Cost (₦)
            </label>
            <input
              type="number"
              name="purchaseCost"
              value={formData.purchaseCost}
              onChange={handleChange}
              placeholder="1000000"
              required
              min="1"
              className={`w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.purchaseCost ? 'border-red-500' : ''
              }`}
            />
            {errors.purchaseCost && (
              <p className="text-xs text-red-500 mt-1">{errors.purchaseCost}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Date
            </label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              required
              className={`w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.purchaseDate ? 'border-red-500' : ''
              }`}
            />
            {errors.purchaseDate && (
              <p className="text-xs text-red-500 mt-1">{errors.purchaseDate}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Residual Value (₦)
            </label>
            <input
              type="number"
              name="residualValue"
              value={formData.residualValue}
              onChange={handleChange}
              onFocus={() => setShowResidualTooltip(true)}
              onBlur={() => setShowResidualTooltip(false)}
              placeholder="0"
              className={`w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.residualValue ? 'border-red-500' : ''
              }`}
            />
            {errors.residualValue && (
              <p className="text-xs text-red-500 mt-1">{errors.residualValue}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Enter the estimated value of the asset at the end of its useful life. Leave blank if unsure.
            </p>
            {showResidualTooltip && (
              <div className="absolute right-0 top-0 mt-10 bg-white p-3 rounded shadow-lg border z-10 w-64">
                <h4 className="font-medium text-sm mb-1">Suggested Residual Values:</h4>
                <ul className="text-xs">
                  <li>Computers: 0-10% of cost</li>
                  <li>Vehicles: 10-20% of cost</li>
                  <li>Machinery: 5-15% of cost</li>
                  <li>Furniture: 5-10% of cost</li>
                  <li>Buildings: 20-30% of cost</li>
                </ul>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Useful Life (years)
            </label>
            <input
              type="number"
              id="usefulLife"
              name="usefulLife"
              min="1"
              value={formData.usefulLife}
              onChange={handleChange}
              className={`w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.usefulLife ? 'border-red-500' : ''
              }`}
            />
            {errors.usefulLife && (
              <p className="text-xs text-red-500 mt-1">{errors.usefulLife}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Tip: Computers (3–5 yrs), Vehicles (5–7 yrs), Furniture (7–10 yrs), 
              Machinery (8-12 yrs), Buildings (20-30 yrs), Tools (3-6 yrs), 
              Leasehold (lease term)
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Depreciation Method
            </label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Straight-Line">Straight-Line</option>
              <option value="Declining Balance">Declining Balance</option>
            </select>
          </div>
          
          {formData.method === 'Declining Balance' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Depreciation Rate (%)
              </label>
              <input
                type="number"
                name="depreciationRate"
                value={formData.depreciationRate}
                onChange={handleChange}
                min="1"
                max="100"
                className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Typical rates: Office Furniture (10-15%), Vehicles (20-25%), 
                Computers (30-40%), Machinery (15-25%), Tools (20-33%), 
                Buildings (2-5%), Leasehold (over lease term)
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Calculate Depreciation
          </button>
        </div>
      </form>
    </div>
  );
}



