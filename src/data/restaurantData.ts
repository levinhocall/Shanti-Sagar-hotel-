import { DishItem, GalleryItem, FacilityItem, ReviewData, RestaurantMeta } from '../types';

export const RESTAURANT_INFO: RestaurantMeta = {
  name: 'Shanti Sagar Pure Veg',
  tagline: 'Pure Vegetarian. Pure Happiness.',
  address: 'Kurla Camp Road, Ulhasnagar',
  fullAddress: 'Shop No. 1, 2, 3 & 4, Maharishi Complex, Kurla Camp Road, near Bhatia Chowk, Kurla Camp, Ulhasnagar, Maharashtra, India.',
  coordinates: { lat: 19.2215, lng: 73.1645 },
  establishedNote: 'Serving authentic pure vegetarian South & North Indian culinary specialties.',
  googleRating: 3.8,
  totalReviews: 1364,
  hours: '7:30 AM – 11:30 PM Everyday',
  orderUrlZomato: 'https://www.zomato.com/mumbai/shanti-sagar-pure-veg-ulhasnagar-thane',
  orderUrlDistrict: 'https://www.district.in/dining/mumbai/shanti-sagar-pure-veg-ulhasnagar-thane',
  phoneContact: '+91 251 252 0000',
  whatsappContact: 'https://wa.me/919999999999?text=Hello%20Shanti%20Sagar%2C%20I%20would%20like%20to%20enquire%20about%20a%20table%20reservation.',
  demoDisclaimer: 'Unofficial Website Concept — Demo Only. This interactive showcase is a creative concept and not an official ordering portal.',
};

export const MENU_ITEMS: DishItem[] = [
  {
    id: 'idli-sambar',
    name: 'Idli & Sambar',
    category: 'South Indian',
    image: '/images/dosa.webp',
    subtitle: 'Soft. Simple. Soulful.',
    description: 'An exploration of South Indian comfort, told through the soft steamed rice cakes, aromatic spiced lentil sambar, and fresh coconut chutney. Prepared fresh daily using traditional fermented batter.',
    mood: 'A gentle morning beginning',
    gallery: ['/images/dosa.webp', '/images/feast.webp'],
    spiceLevel: 'Mild',
    tags: ['Traditional Recipe', 'Steam Cooked', 'Comfort Classic'],
    verifiedDietary: ['100% Pure Veg', 'Vegan Friendly', 'Gluten Free Option'],
    servingStyle: 'Served steaming hot with fresh coconut and tomato chutney',
    chefNote: 'Illustrative presentation for this digital concept. Not a confirmed restaurant recipe card.'
  },
  {
    id: 'masala-dosa',
    name: 'Crispy Masala Dosa',
    category: 'South Indian',
    image: '/images/dosa.webp',
    subtitle: 'Golden crispness with spiced potato warmth.',
    description: 'Thin, crispy crepe roasted on a hot flat-top seasoned cast iron tawa until bronzed and crisp, wrapped around gently spiced turmeric potato masala, served with aromatic piping hot sambar.',
    mood: 'The golden hour on the plate',
    gallery: ['/images/dosa.webp', '/images/feast.webp'],
    spiceLevel: 'Medium',
    tags: ['Crispy Texture', 'Slow Fermented', 'South Indian Iconic'],
    verifiedDietary: ['100% Pure Veg', 'Nut Free', 'Jain Option Upon Request'],
    servingStyle: 'Golden rolled parchment served with tri-color chutneys',
    chefNote: 'Illustrative menu item demonstration with licensed demo imagery.'
  },
  {
    id: 'paneer-curry',
    name: 'Paneer Butter Masala',
    category: 'North Indian',
    image: '/images/paneer.webp',
    subtitle: 'Rich colour. Quiet indulgence.',
    description: 'Tender cottage cheese cubes simmered in a luscious tomato and cashew silk gravy, infused with roasted kasuri methi and fragrant whole spices. A celebrated staple of North Indian vegetarian dining.',
    mood: 'Comfort in deep colour',
    gallery: ['/images/paneer.webp', '/images/feast.webp'],
    spiceLevel: 'Mild',
    tags: ['Velvety Gravy', 'Fresh Cottage Cheese', 'North Indian Favorite'],
    verifiedDietary: ['100% Pure Veg', 'Gluten Free'],
    servingStyle: 'Piped with fresh cream swirls and butter, paired with garlic naan or basmati',
    chefNote: 'Sample dish representation for UI concept demonstration.'
  },
  {
    id: 'vegetable-biryani',
    name: 'Dum Vegetable Biryani',
    category: 'Rice & More',
    image: '/images/biryani.webp',
    subtitle: 'Layers of fragrance worth lingering over.',
    description: 'Long-grain aged basmati rice layered with garden-fresh vegetables, saffron-infused milk, caramelized onions, and whole warm spices, slow-steamed under sealed dum to lock in every aromatic layer.',
    mood: 'The joy of slow celebratory dining',
    gallery: ['/images/biryani.webp', '/images/feast.webp'],
    spiceLevel: 'Rich & Fragrant',
    tags: ['Aged Basmati', 'Slow Dum Cooked', 'Saffron Infused'],
    verifiedDietary: ['100% Pure Veg', 'Vegan Accommodated'],
    servingStyle: 'Served in an earthen handi with chilled cucumber-mint raita and salan',
    chefNote: 'Photographic representation for digital portfolio demonstration.'
  },
  {
    id: 'royal-thali',
    name: 'Grand Pure Veg Thali',
    category: 'Specialties',
    image: '/images/feast.webp',
    subtitle: 'The full spectrum of pure vegetarian abundance.',
    description: 'A curated multi-course culinary journey across regional vegetarian traditions: seasonal curries, dal tadka, hot rotis, fragrant rice, crisp papad, raita, and handcrafted sweet concluding bite.',
    mood: 'The celebration of culinary wholeness',
    gallery: ['/images/feast.webp', '/images/paneer.webp', '/images/dosa.webp'],
    spiceLevel: 'Medium',
    tags: ['Unlimited Feast Concept', 'Balanced Nutrition', 'Multi-Course Experience'],
    verifiedDietary: ['100% Pure Veg', 'All-You-Can-Eat Feature'],
    servingStyle: 'Arranged in traditional brass katoris across an expansive royal platter',
    chefNote: 'Illustrative feast concept reflecting Shanti Sagar all-you-can-eat facility.'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'feast',
    src: '/images/feast.webp',
    title: 'The Art of Shared Abundance',
    credit: 'Unsplash photo-1546833999-b9f581a1996d',
    caption: 'Gathering around the vibrant colors of an authentic Indian vegetarian feast.'
  },
  {
    id: 'dosa',
    src: '/images/dosa.webp',
    title: 'A Golden Morning Ritual',
    credit: 'Unsplash photo-1630383249896-424e482df921',
    caption: 'Crisp golden edges, steaming sambar, and the warmth of a timeless South Indian classic.'
  },
  {
    id: 'paneer',
    src: '/images/paneer.webp',
    title: 'Rich Palette & Spiced Textures',
    credit: 'Unsplash photo-1631452180519-c014fe946bc7',
    caption: 'Silken gravies, fresh paneer, and the visual drama of North Indian comfort cuisine.'
  },
  {
    id: 'biryani',
    src: '/images/biryani.webp',
    title: 'A World of Saffron & Spice',
    credit: 'Unsplash photo-1642821373181-696a54913e93',
    caption: 'Long fragrant grains of basmati infused with caramelized aromatics and warm spices.'
  }
];

export const FACILITIES: FacilityItem[] = [
  {
    id: 'purity',
    title: '100% Pure Vegetarian Kitchen',
    subtitle: 'Strict Dietary Integrity',
    description: 'Zero meat, zero eggs. Every utensil, ingredient, and preparation surface adheres strictly to the revered values of pure vegetarian cuisine.',
    iconName: 'ShieldCheck',
    tag: 'Core Ethos'
  },
  {
    id: 'private-dining',
    title: 'Private Family Dining Room',
    subtitle: 'Quiet Celebrations & Banquets',
    description: 'An exclusive, serene dining sanctuary dedicated to family gatherings, intimate reunions, and joyous celebrations with attentive personal table service.',
    iconName: 'Users',
    tag: 'Verified Feature'
  },
  {
    id: 'all-you-can-eat',
    title: 'All-You-Can-Eat Abundance',
    subtitle: 'Unlimited Pure Vegetarian Feasts',
    description: 'Generous unlimited servings of regional curries, hot breads, and accompaniments, honoring the timeless Indian hospitality principle of Atithi Devo Bhava.',
    iconName: 'Sparkles',
    tag: 'Verified Feature'
  },
  {
    id: 'vegan-friendly',
    title: 'Vegan & Jain Friendly Options',
    subtitle: 'Mindful Dietary Flexibility',
    description: 'Clear, attentive ingredient labeling and customizable preparations respecting root-vegetable restrictions and dairy-free preferences.',
    iconName: 'Leaf',
    tag: 'Dietary Flexibility'
  }
];

export const REVIEW_DATA: ReviewData = {
  platform: 'Google Maps Verified Listing',
  rating: 3.8,
  totalReviews: 1364,
  verifiedLocation: 'Kurla Camp Road, Ulhasnagar, Maharashtra',
  reviewLink: 'https://www.google.com/maps/search/Shanti+Sagar+Pure+Veg+Ulhasnagar',
  highlights: [
    { title: 'South Indian Excellence', count: '480+', text: 'Patrons consistently praise the crisp dosas, soft idlis, and authentic coconut chutneys.' },
    { title: 'Family Atmosphere', count: '320+', text: 'Spacious private dining arrangements ideal for quiet family lunches and celebratory weekend dinners.' },
    { title: 'Generous Portions', count: '290+', text: 'Appreciated for generous thali spreads and prompt, warm Indian hospitality.' }
  ]
};
