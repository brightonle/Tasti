export type VendorCategory =
  | 'tacos'
  | 'fruit'
  | 'dessert'
  | 'bbq'
  | 'drinks'
  | 'other';

export interface FsTimestamp {
  toDate: () => Date;
  seconds: number;
  nanoseconds: number;
}

export interface MenuItem {
  name: string;
  price: number;
  description?: string;
}

export interface DayHours {
  open: string;
  close: string;
}

export interface LiveLocation {
  lat: number;
  lng: number;
  address: string;
  updatedAt: FsTimestamp;
}

export interface VendorDocument {
  uid: string;
  displayName: string;
  description: string;
  category: VendorCategory;
  tags: string[];
  phone: string | null;
  instagramHandle: string | null;
  profileImageUrl: string | null;
  menuImages: string[];
  menuHighlights: MenuItem[];
  hours: Record<string, DayHours | null>;
  averageRating: number;
  reviewCount: number;
  isLive: boolean;
  liveLocation: LiveLocation | null;
  fcmTokens: string[];
  createdAt: FsTimestamp;
  updatedAt: FsTimestamp;
}

export interface LocationDocument {
  lat: number;
  lng: number;
  vendorId: string;
  category: VendorCategory;
  displayName: string;
  profileImageUrl: string | null;
  isLive: boolean;
  updatedAt: FsTimestamp;
}
