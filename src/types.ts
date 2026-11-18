export interface DishItem {
  id: string;
  name: string;
  category: 'South Indian' | 'North Indian' | 'Rice & More' | 'Specialties';
  image: string;
  subtitle: string;
  description: string;
  gallery: string[];
  conceptVisual?: { card: string; large: string; alt: string };
}

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  credit: string;
  caption: string;
  large?: string;
  conceptOnly?: boolean;
}
