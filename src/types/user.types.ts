import { FsTimestamp } from './vendor.types';

export interface UserDocument {
  uid: string;
  role: 'customer' | 'vendor';
  displayName: string;
  email: string;
  avatarUrl: string | null;
  favorites: string[];
  fcmToken: string | null;
  notificationsEnabled: boolean;
  notifyRadiusKm: number;
  createdAt: FsTimestamp;
}
