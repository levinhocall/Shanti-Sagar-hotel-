export type FoodStory = {
  id: 'paneer' | 'thali' | 'dosa'
  name: string
  image: string
  mobile: string
  imageAlt: string
  position: string
  scenes: readonly string[]
  frameSequence?: { directory: string; count: number }
}

export const FOOD_STORIES: FoodStory[] = [
  {
    id: 'paneer', name: 'Royal Paneer', image: '/images/v4/paneer-wide.webp', mobile: '/images/v4/paneer-mobile.webp',
    imageAlt: 'Concept photograph of paneer cubes above curry in a copper bowl', position: '68% center',
    frameSequence: { directory: '/images/v4/paneer-frames', count: 16 },
    scenes: ['A Celebration of Pure Vegetarian Flavours.', 'Rich Textures. Timeless Indian Inspiration.', 'Every Detail, Beautifully Presented.', 'Discover the Art of Vegetarian Dining.'],
  },
  {
    id: 'thali', name: 'Grand Thali', image: '/images/v4/thali-960.webp', mobile: '/images/v4/thali-600.webp',
    imageAlt: 'Concept photograph of a brass thali with colourful vegetarian accompaniments', position: 'center',
    scenes: ['A Feast of Colours.', 'Many Flavours. One Beautiful Experience.', 'Tradition on Every Plate.', 'The Joy of Dining Together.'],
  },
  {
    id: 'dosa', name: 'Golden Dosa', image: '/images/v4/dosa-960.webp', mobile: '/images/v4/dosa-600.webp',
    imageAlt: 'Concept photograph of golden masala dosa with chutneys and sambar', position: '60% center',
    scenes: ['Golden. Crisp. Irresistible.', 'Inspired by South Indian Traditions.', 'A Symphony of Texture and Flavour.', 'Discover Something Delicious.'],
  },
]
