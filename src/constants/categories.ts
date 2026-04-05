import { VendorCategory } from '../types/vendor.types';

export const VENDOR_CATEGORIES: VendorCategory[] = [
  'tacos',
  'fruit',
  'dessert',
  'bbq',
  'drinks',
  'other',
];

export const CATEGORY_LABELS: Record<VendorCategory, string> = {
  tacos: 'Tacos',
  fruit: 'Fruit',
  dessert: 'Dessert',
  bbq: 'BBQ',
  drinks: 'Drinks',
  other: 'Other',
};

export const CATEGORY_EMOJI: Record<VendorCategory, string> = {
  tacos: '🌮',
  fruit: '🍉',
  dessert: '🍦',
  bbq: '🔥',
  drinks: '🥤',
  other: '🍽️',
};

export const CATEGORY_COLOR: Record<VendorCategory, string> = {
  tacos: '#E67E22',
  fruit: '#27AE60',
  dessert: '#E91E8C',
  bbq: '#C0392B',
  drinks: '#2980B9',
  other: '#226F54',
};
