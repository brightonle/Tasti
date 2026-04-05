import { VendorCategory } from '../../types/vendor.types';

export async function goLive(
  _vendorId: string, _lat: number, _lng: number, _address: string,
  _category: VendorCategory, _displayName: string, _profileImageUrl: string | null
) {}

export async function goOffline(_vendorId: string) {}
