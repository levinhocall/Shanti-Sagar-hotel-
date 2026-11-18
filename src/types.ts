export interface DishItem {
  id: string;
  name: string;
  category: 'All' | 'South Indian' | 'North Indian' | 'Rice & More' | 'Specialties';
  image: string;
  subtitle: string;
  description: string;
  mood: string;
  gallery: string[];
  spiceLevel?: 'Mild' | 'Medium' | 'Rich & Fragrant';
  tags: string[];
  verifiedDietary: string[];
  servingStyle?: string;
  chefNote?: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  credit: string;
  caption: string;
  aspect?: string;
}

export interface FacilityItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  tag: string;
}

export interface ReviewData {
  platform: string;
  rating: number;
  totalReviews: number;
  verifiedLocation: string;
  reviewLink: string;
  highlights: { title: string; count: string; text: string }[];
}

export interface RestaurantMeta {
  name: string;
  tagline: string;
  address: string;
  fullAddress: string;
  coordinates: { lat: number; lng: number };
  establishedNote: string;
  googleRating: number;
  totalReviews: number;
  hours: string;
  orderUrlZomato: string;
  orderUrlDistrict: string;
  phoneContact: string;
  whatsappContact: string;
  demoDisclaimer: string;
}
