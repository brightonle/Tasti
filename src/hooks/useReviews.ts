import { MOCK_REVIEWS } from '../mock/data';
import { ReviewDocument } from '../types/review.types';

export function useReviews(vendorId: string | null): { reviews: ReviewDocument[]; loading: boolean } {
  const reviews = vendorId ? (MOCK_REVIEWS[vendorId] ?? []) : [];
  return { reviews, loading: false };
}
