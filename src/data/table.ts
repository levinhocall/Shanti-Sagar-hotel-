export const FOOD_HOTSPOTS = {
  paneer: { name: 'Paneer', description: 'Rust coloured gravy, paneer cubes and a swirl of cream in a brass bowl.' },
  dal: { name: 'Dal', description: 'Golden lentils with a scatter of tempering spices and coriander.' },
  rice: { name: 'Rice', description: 'A mound of basmati with saffron coloured grains and herbs.' },
} as const;

export const LIGHTS = {
  golden: { name: 'Golden', color: '#ffdfad', fill: '#a6c6bb', intensity: 3.5 },
  candle: { name: 'Candlelight', color: '#ffab61', fill: '#be8253', intensity: 2.1 },
  daylight: { name: 'Daylight', color: '#fff2e4', fill: '#d0e5ff', intensity: 3.6 },
} as const;

export type LightMode = keyof typeof LIGHTS;
export type Hotspot = keyof typeof FOOD_HOTSPOTS;
