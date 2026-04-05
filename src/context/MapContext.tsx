import React, { createContext, useContext, useState } from 'react';

interface MapContextValue {
  selectedVendorId: string | null;
  setSelectedVendorId: (id: string | null) => void;
}

const MapContext = createContext<MapContextValue>({
  selectedVendorId: null,
  setSelectedVendorId: () => {},
});

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  return (
    <MapContext.Provider value={{ selectedVendorId, setSelectedVendorId }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  return useContext(MapContext);
}
