export type ScheduleEntry = {
  year: number;
  depreciation: number;
  accumulated: number;
  bookValue: number;
};

// Update the property name to match what's used in the Chart component
export function calculateStraightLine(
  cost: number,
  residualValue: number,
  usefulLife: number
): ScheduleEntry[] {
  const depreciableAmount = cost - residualValue;
  const annualDepreciation = depreciableAmount / usefulLife;
  
  const schedule: ScheduleEntry[] = [];
  let currentBookValue = cost;
  
  // Initial entry (year 0)
  schedule.push({
    year: 0,
    depreciation: 0,
    accumulated: 0,
    bookValue: currentBookValue
  });
  
  // Calculate yearly depreciation
  for (let year = 1; year <= usefulLife; year++) {
    const depreciation = annualDepreciation;
    const accumulated = year * annualDepreciation;
    currentBookValue = cost - accumulated;
    
    // Ensure book value doesn't go below residual value due to rounding
    const bookValue = Math.max(currentBookValue, residualValue);
    
    schedule.push({
      year,
      depreciation,
      accumulated,
      bookValue
    });
  }
  
  return schedule;
}

export function calculateDecliningBalance(
  cost: number,
  residualValue: number,
  usefulLife: number,
  rate: number = 20.0 // Default to 20% if not specified
): ScheduleEntry[] {
  // Convert percentage to decimal
  const decliningRate = rate / 100;
  
  const schedule: ScheduleEntry[] = [];
  let currentBookValue = cost;
  let accumulatedDepreciation = 0;
  
  // Initial entry (year 0)
  schedule.push({
    year: 0,
    depreciation: 0,
    accumulated: 0,
    bookValue: currentBookValue
  });
  
  // Calculate yearly depreciation
  for (let year = 1; year <= usefulLife; year++) {
    // Calculate declining balance depreciation
    let depreciation = currentBookValue * decliningRate;
    
    // Ensure we don't depreciate below residual value
    if (currentBookValue - depreciation < residualValue) {
      depreciation = currentBookValue - residualValue;
    }
    
    // If depreciation would be negative, set it to zero
    if (depreciation < 0) {
      depreciation = 0;
    }
    
    accumulatedDepreciation += depreciation;
    currentBookValue -= depreciation;
    
    // Ensure book value doesn't go below residual value
    const bookValue = Math.max(currentBookValue, residualValue);
    
    schedule.push({
      year,
      depreciation,
      accumulated: accumulatedDepreciation,
      bookValue
    });
    
    // If we've reached the residual value, no more depreciation occurs
    if (currentBookValue <= residualValue) {
      // Fill the remaining years with the same values
      for (let remainingYear = year + 1; remainingYear <= usefulLife; remainingYear++) {
        schedule.push({
          year: remainingYear,
          depreciation: 0,
          accumulated: accumulatedDepreciation,
          bookValue: residualValue
        });
      }
      break;
    }
  }
  
  return schedule;
}

