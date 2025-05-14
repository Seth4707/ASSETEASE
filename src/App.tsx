import { useState } from 'react'
import { AssetForm } from './components/AssetForm'
import type { AssetData } from './components/AssetForm'
import { DepreciationSchedule } from './components/DepreciationSchedule'
import { AssetSummary } from './components/AssetSummary'
import { Chart } from './components/Chart'
import { ExportOptions } from './components/ExportOptions'
import { AssetRegister } from './components/AssetRegister'
import { AssetProvider } from './context/AssetContext'
import { calculateStraightLine, calculateDecliningBalance } from './utils/depreciation'
import type { ScheduleEntry } from './utils/depreciation'
import { generateId } from './utils/helpers'
import type { Asset } from './types/asset'

function AppContent() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'register'>('calculator')
  const [assetData, setAssetData] = useState<AssetData | null>(null)
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([])
  const [currentYear, setCurrentYear] = useState<number>(1)
  const [currentBookValue, setCurrentBookValue] = useState<number>(0)
  
  // Import useAssets inside the component that's wrapped by AssetProvider
  const { addAsset } = useAssets()

  const handleCalculate = (data: AssetData) => {
    setAssetData(data)
    
    // Calculate depreciation schedule based on method
    let depreciationSchedule: ScheduleEntry[]
    
    if (data.method === 'Straight-Line') {
      depreciationSchedule = calculateStraightLine(
        data.purchaseCost,
        data.residualValue,
        data.usefulLife
      )
    } else {
      depreciationSchedule = calculateDecliningBalance(
        data.purchaseCost,
        data.residualValue,
        data.usefulLife,
        data.depreciationRate // Pass the user-specified rate
      )
    }
    
    setSchedule(depreciationSchedule)
    setCurrentYear(1) // Reset to first year when recalculating
    setCurrentBookValue(depreciationSchedule[0]?.bookValue || data.purchaseCost)
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = parseInt(e.target.value, 10)
    setCurrentYear(year)
    
    // Update current book value based on selected year
    if (schedule.length > 0) {
      const yearData = schedule.find(entry => entry.year === year)
      if (yearData) {
        setCurrentBookValue(yearData.bookValue)
      }
    }
  }
  
  const handleSaveAsset = () => {
    if (!assetData || schedule.length === 0) return
    
    const newAsset: Asset = {
      id: generateId(),
      assetName: assetData.assetName,
      assetType: assetData.assetType,
      purchaseCost: assetData.purchaseCost,
      residualValue: assetData.residualValue,
      purchaseDate: assetData.purchaseDate || new Date().toISOString().split('T')[0],
      usefulLife: assetData.usefulLife,
      method: assetData.method,
      depreciationRate: assetData.depreciationRate,
      schedule: [...schedule]
    }
    
    addAsset(newAsset)
    alert('Asset saved to register!')
  }

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-2 sm:py-8 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="relative flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-8">
          <div className="sm:absolute sm:left-0">
            <img src="/Assetease.png" alt="AssetEase Logo" className="h-12 sm:h-16 mb-2 sm:mb-0" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center w-full text-blue-600">
            Asset Depreciation Calculator
          </h1>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-8 border-2 border-blue-500">
          <p className="text-base sm:text-lg font-medium text-gray-800 text-center">
            AssetEase. Know your asset. Track its value. Stay compliant.
          </p>
        </div>
        
        {/* Tab navigation - make it more touch-friendly */}
        <div className="mb-4 sm:mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-2 px-3 sm:px-4 text-sm sm:text-base ${activeTab === 'calculator' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('calculator')}
            >
              Calculator
            </button>
            <button
              className={`py-2 px-3 sm:px-4 text-sm sm:text-base ${activeTab === 'register' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('register')}
            >
              Asset Register
            </button>
          </div>
        </div>
        
        {activeTab === 'calculator' ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <AssetForm onCalculate={handleCalculate} />
            
            {assetData && schedule.length > 0 && (
              <>
                <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                  <label className="font-medium">Select Year: </label>
                  <input
                    type="range"
                    min="0"
                    max={assetData.usefulLife}
                    value={currentYear}
                    onChange={handleYearChange}
                    className="w-full mt-2"
                  />
                  <div className="text-center mt-1">Year {currentYear}</div>
                </div>
                
                <AssetSummary
                  assetName={assetData.assetName}
                  assetType={assetData.assetType}
                  purchaseCost={assetData.purchaseCost}
                  residualValue={assetData.residualValue}
                  method={assetData.method}
                  usefulLife={assetData.usefulLife}
                  currentYear={currentYear}
                  bookValue={currentBookValue}
                  depreciationRate={assetData.method === 'Declining Balance' ? assetData.depreciationRate : undefined}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <Chart schedule={schedule} type="depreciation" />
                  <Chart schedule={schedule} type="bookValue" />
                </div>
                
                <ExportOptions 
                  schedule={schedule}
                  assetName={assetData.assetName}
                />
                
                <DepreciationSchedule 
                  schedule={schedule}
                  assetName={assetData.assetName}
                />
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSaveAsset}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Save to Asset Register
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <AssetRegister />
        )}
      </div>
    </div>
  )
}

// Need to import useAssets here
import { useAssets } from './context/AssetContext'

function App() {
  return (
    <AssetProvider>
      <AppContent />
    </AssetProvider>
  )
}

export default App









