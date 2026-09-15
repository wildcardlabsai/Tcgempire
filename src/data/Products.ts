export interface Product {
  id: string;
  name: string;
  category: 'booster' | 'deck' | 'box' | 'accessories';
  costPrice: number;
  sellPrice: number;
  color: number;
  description: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'dragon-booster',
    name: 'Dragon Realms Booster',
    category: 'booster',
    costPrice: 2,
    sellPrice: 4,
    color: 0xe74c3c,
    description: 'A booster pack from the Dragon Realms set.',
  },
  {
    id: 'ocean-booster',
    name: 'Ocean Legends Booster',
    category: 'booster',
    costPrice: 2,
    sellPrice: 4,
    color: 0x3498db,
    description: 'A booster pack from the Ocean Legends set.',
  },
  {
    id: 'forest-booster',
    name: 'Forest Spirits Booster',
    category: 'booster',
    costPrice: 2,
    sellPrice: 4,
    color: 0x2ecc71,
    description: 'A booster pack from the Forest Spirits set.',
  },
  {
    id: 'starter-deck',
    name: 'Starter Deck',
    category: 'deck',
    costPrice: 8,
    sellPrice: 15,
    color: 0xf39c12,
    description: 'A ready-to-play starter deck for beginners.',
  },
  {
    id: 'elite-box',
    name: 'Elite Trainer Box',
    category: 'box',
    costPrice: 25,
    sellPrice: 45,
    color: 0x9b59b6,
    description: 'A premium box with boosters, sleeves and more.',
  },
  {
    id: 'card-sleeves',
    name: 'Card Sleeves (50)',
    category: 'accessories',
    costPrice: 2,
    sellPrice: 5,
    color: 0x1abc9c,
    description: 'Protective sleeves to keep cards safe.',
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
