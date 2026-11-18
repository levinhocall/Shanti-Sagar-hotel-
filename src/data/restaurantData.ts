import type { DishItem, GalleryItem } from '../types';

export const RESTAURANT_INFO = {
  name: 'Shanti Sagar Pure Veg',
  address: 'Maharishi Complex, Camp Road, Ulhasnagar, Thane 421005',
  phone: '+912512527778',
  phoneLabel: '+91 251 252 7778',
  zomato: 'https://www.zomato.com/mumbai/shanti-sagar-pure-veg-ulhasnagar-thane',
  orderUrl: 'https://www.zomato.com/mumbai/shanti-sagar-pure-veg-ulhasnagar-thane/order',
  district: 'https://www.district.in/dining/mumbai/shanti-sagar-pure-veg-ulhasnagar-thane',
};

export const MENU_ITEMS: DishItem[] = [
  {
    id: 'idli-sambar',
    name: 'Idli & sambar',
    category: 'South Indian',
    image: '/images/dosa.webp',
    subtitle: 'Soft. Simple. Soulful.',
    description: 'An exploration of South Indian comfort, told through the soft steamed rice cakes, aromatic spiced lentil sambar, and fresh coconut chutney. A familiar combination of soft idli and fragrant sambar.',
    gallery: ['/images/dosa.webp', '/images/feast.webp'],
  },
  {
    id: 'masala-dosa',
    name: 'Masala dosa',
    category: 'South Indian',
    image: '/images/dosa.webp',
    subtitle: 'Golden crispness with spiced potato warmth.',
    description: 'Thin, crispy crepe roasted on a hot flat-top seasoned cast iron tawa until bronzed and crisp, wrapped around gently spiced turmeric potato masala, served with aromatic piping hot sambar.',
    gallery: ['/images/dosa.webp', '/images/feast.webp'],
  },
  {
    id: 'paneer-curry',
    name: 'Paneer curry',
    category: 'North Indian',
    image: '/images/paneer.webp',
    subtitle: 'Rich colour. Quiet indulgence.',
    description: 'Tender cottage cheese cubes simmered in a luscious tomato and cashew silk gravy, infused with roasted kasuri methi and fragrant whole spices. A celebrated staple of North Indian vegetarian dining.',
    gallery: ['/images/paneer.webp', '/images/feast.webp'],
  },
  {
    id: 'vegetable-biryani',
    name: 'Vegetable biryani',
    category: 'Rice & More',
    image: '/images/biryani.webp',
    subtitle: 'Layers of fragrance worth lingering over.',
    description: 'Long-grain aged basmati rice layered with garden-fresh vegetables, saffron-infused milk, caramelized onions, and whole warm spices, slow-steamed under sealed dum to lock in every aromatic layer.',
    gallery: ['/images/biryani.webp', '/images/feast.webp'],
  },
  {
    id: 'royal-thali',
    name: 'Vegetarian thali',
    category: 'Specialties',
    image: '/images/feast.webp',
    subtitle: 'The full spectrum of pure vegetarian abundance.',
    description: 'A curated multi-course culinary journey across regional vegetarian traditions: seasonal curries, dal tadka, hot rotis, fragrant rice, crisp papad, raita, and handcrafted sweet concluding bite.',
    gallery: ['/images/feast.webp', '/images/paneer.webp', '/images/dosa.webp'],
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'feast',
    src: '/images/feast.webp',
    title: 'The art of sharing',
    credit: 'Unsplash photo-1546833999-b9f581a1996d',
    caption: 'Gathering around the vibrant colors of an shared vegetarian spread.'
  },
  {
    id: 'dosa',
    src: '/images/dosa.webp',
    title: 'Idli and chutney',
    credit: 'Unsplash photo-1630383249896-424e482df921',
    caption: 'Soft idli, sambar and chutney.'
  },
  {
    id: 'paneer',
    src: '/images/paneer.webp',
    title: 'Paneer and spice',
    credit: 'Unsplash photo-1631452180519-c014fe946bc7',
    caption: 'Silken gravies, fresh paneer, and the visual drama of North Indian comfort cuisine.'
  },
  {
    id: 'biryani',
    src: '/images/biryani.webp',
    title: 'A bowl of biryani',
    credit: 'Unsplash photo-1642821373181-696a54913e93',
    caption: 'Long fragrant grains of basmati infused with caramelized aromatics and warm spices.'
  }
];

export const MAP_QUERY = 'Shanti Sagar Pure Veg, Maharishi Complex, Camp Road, Ulhasnagar';
export const MAP_SEARCH = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;
export const DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAP_QUERY)}`;
