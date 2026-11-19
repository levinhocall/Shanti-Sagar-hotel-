export type FoodStory = {
  id: 'paneer' | 'thali' | 'dosa'
  name: string
  image: string
  mobile: string
  imageAlt: string
  position: string
  scenes: readonly string[]
}

export const FOOD_STORIES: FoodStory[] = [
  {
    id: 'paneer', name: 'Royal Paneer', image: '/images/paneer-900.webp', mobile: '/images/paneer-480.webp',
    imageAlt: 'Paneer curry with grilled flatbread', position: 'center 67%',
    scenes: ['A Celebration of Pure Vegetarian Flavours.', 'Rich Textures. Timeless Indian Inspiration.', 'Every Detail, Beautifully Presented.', 'Discover the Art of Vegetarian Dining.'],
  },
  {
    id: 'thali', name: 'Grand Thali', image: '/images/editorial/vegetarian-thali-900.webp', mobile: '/images/editorial/vegetarian-thali-480.webp',
    imageAlt: 'Vegetarian thali with rice, breads and small bowls', position: 'center',
    scenes: ['A Feast of Colours.', 'Many Flavours. One Beautiful Experience.', 'Tradition on Every Plate.', 'The Joy of Dining Together.'],
  },
  {
    id: 'dosa', name: 'Golden Dosa', image: '/images/editorial/masala-dosa-900.webp', mobile: '/images/editorial/masala-dosa-480.webp',
    imageAlt: 'Photograph of golden masala dosa with chutneys and sambar', position: '60% center',
    scenes: ['Golden. Crisp. Irresistible.', 'Inspired by South Indian Traditions.', 'A Symphony of Texture and Flavour.', 'Discover Something Delicious.'],
  },
]
