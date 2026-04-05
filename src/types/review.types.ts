import { FsTimestamp } from './vendor.types';

export interface ReviewDocument {
  id?: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  rating: number;
  text: string;
  createdAt: FsTimestamp;
}
