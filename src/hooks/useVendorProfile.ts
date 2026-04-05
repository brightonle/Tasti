import { MOCK_VENDORS } from '../mock/data';
import { VendorDocument } from '../types/vendor.types';

export function useVendorProfile(vendorId: string | null): { vendor: VendorDocument | null; loading: boolean } {
  const vendor = MOCK_VENDORS.find((v) => v.uid === vendorId) ?? null;
  return { vendor, loading: false };
}
