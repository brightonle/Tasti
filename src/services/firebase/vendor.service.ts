import { VendorDocument } from '../../types/vendor.types';

export async function getVendor(_vendorId: string): Promise<VendorDocument | null> { return null; }
export async function updateVendorProfile(_vendorId: string, _updates: Partial<VendorDocument>) {}
