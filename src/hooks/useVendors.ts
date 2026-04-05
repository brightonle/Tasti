import { MOCK_LOCATIONS } from '../mock/data';
import { LocationDocument } from '../types/vendor.types';

export function useVendors(): { vendors: LocationDocument[]; loading: boolean } {
  return { vendors: MOCK_LOCATIONS, loading: false };
}
