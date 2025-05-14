import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Asset, AssetRegister } from '../types/asset';

type AssetContextType = {
  assets: AssetRegister;
  addAsset: (asset: Asset) => void;
  updateAsset: (asset: Asset) => void;
  deleteAsset: (id: string) => void;
  getAsset: (id: string) => Asset | undefined;
};

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export function AssetProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<AssetRegister>(() => {
    // Load assets from localStorage on initial render
    const savedAssets = localStorage.getItem('assetRegister');
    return savedAssets ? JSON.parse(savedAssets) : [];
  });

  // Save assets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('assetRegister', JSON.stringify(assets));
  }, [assets]);

  const addAsset = (asset: Asset) => {
    setAssets(prev => [...prev, asset]);
  };

  const updateAsset = (asset: Asset) => {
    setAssets(prev => prev.map(a => a.id === asset.id ? asset : a));
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  const getAsset = (id: string) => {
    return assets.find(a => a.id === id);
  };

  return (
    <AssetContext.Provider value={{ assets, addAsset, updateAsset, deleteAsset, getAsset }}>
      {children}
    </AssetContext.Provider>
  );
}

export function useAssets() {
  const context = useContext(AssetContext);
  if (context === undefined) {
    throw new Error('useAssets must be used within an AssetProvider');
  }
  return context;
}

