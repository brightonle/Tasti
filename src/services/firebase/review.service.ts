import { ReviewDocument } from '../../types/review.types';

export async function createReview(_vendorId: string, _review: Omit<ReviewDocument, 'createdAt' | 'id'>) {}
export async function getUserReviewForVendor(_vendorId: string, _userId: string): Promise<ReviewDocument | null> { return null; }
