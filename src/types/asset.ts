import type { ScheduleEntry } from '../utils/depreciation';

export type Asset = {
  id: string;
  assetName: string;
  assetType: string;
  purchaseCost: number;
  residualValue: number;
  purchaseDate: string;
  usefulLife: number;
  method: 'Straight-Line' | 'Declining Balance';
  depreciationRate?: number;
  schedule: ScheduleEntry[];
};

export type AssetRegister = Asset[];


