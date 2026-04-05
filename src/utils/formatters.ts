import { formatDistanceToNow } from 'date-fns';

export function timeAgo(timestamp: { toDate: () => Date }): string {
  return formatDistanceToNow(timestamp.toDate(), { addSuffix: true });
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}
