export interface Coords {
  lat: number;
  lng: number;
}

// Mock location — downtown LA
const MOCK_COORDS: Coords = { lat: 34.0522, lng: -118.2437 };

export function useLocation() {
  return {
    coords: MOCK_COORDS,
    permissionGranted: true,
    loading: false,
    getCurrentLocation: async () => MOCK_COORDS,
  };
}
