export const restaurant = {
  name: 'Shanti Sagar Pure Veg',
  address: 'Shop No. 1, 2, 3 & 4, Maharishi Complex, Kurla Camp Road, near Bhatia Chowk, Kurla Camp, Ulhasnagar, Maharashtra, India.',
  district: 'https://www.district.in/dining/mumbai/shanti-sagar-pure-veg-ulhasnagar-thane',
  zomato: 'https://www.zomato.com/mumbai/shanti-sagar-pure-veg-ulhasnagar-thane',
  // Populate only after verifying the exact destinations with the restaurant.
  googleMapsListing: '', phone: '', whatsapp: '', orderOnline: '',
}
export const mapSearch = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(restaurant.name + ' ' + restaurant.address)
export const mapEmbed = 'https://www.google.com/maps?q=' + encodeURIComponent(restaurant.name + ' Maharishi Complex Ulhasnagar') + '&output=embed'
export const photography = [
  { id: 'feast', src: '/images/feast.webp', title: 'The art of sharing', credit: 'photo-1546833999-b9f581a1996d' },
  { id: 'dosa', src: '/images/dosa.webp', title: 'A golden moment', credit: 'photo-1630383249896-424e482df921' },
  { id: 'paneer', src: '/images/paneer.webp', title: 'Colour on the table', credit: 'photo-1631452180519-c014fe946bc7' },
  { id: 'biryani', src: '/images/biryani.webp', title: 'A world of warmth', credit: 'photo-1642821373181-696a54913e93' },
]
export const dishes = [
  { id: 'idli-sambar', name: 'Idli & sambar', category: 'South Indian', image: 'dosa', subtitle: 'Soft. Simple. Soulful.', description: 'An exploration of South Indian comfort, told through the soft shapes and warm colours of a breakfast table. An illustrative dish concept for this website, not a confirmed restaurant offering.', mood: 'A gentle beginning', gallery: ['dosa', 'feast'] },
  { id: 'paneer-curry', name: 'Paneer curry', category: 'North Indian', image: 'paneer', subtitle: 'Rich colour. Quiet indulgence.', description: 'A visual celebration of North Indian comfort food. This sample presentation explores rich colour and the pleasure of gathering around the table. The restaurant’s recipe and availability have not been confirmed.', mood: 'Comfort in colour', gallery: ['paneer', 'feast'] },
  { id: 'vegetable-biryani', name: 'Vegetable biryani', category: 'Rice & more', image: 'biryani', subtitle: 'Layers worth lingering over.', description: 'A sample rice dish, presented as a study in texture, warmth and the ritual of a shared meal. Photography and descriptions are illustrative; they do not establish the restaurant’s ingredients or preparation.', mood: 'The joy of slow moments', gallery: ['biryani', 'feast'] },
]
export type Dish = typeof dishes[number]
export function imageFor(id: string) { return photography.find(image => image.id === id) ?? photography[0] }
