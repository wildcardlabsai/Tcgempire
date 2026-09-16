export interface Product {
  id: string;
  name: string;
  category: 'booster' | 'deck' | 'box' | 'accessories';
  costPrice: number;
  sellPrice: number;
  color: number;
  description: string;
  textureKey: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'dragon-booster',
    name: 'Genesis: Dragon Realms',
    category: 'booster',
    costPrice: 2,
    sellPrice: 4,
    color: 0xe74c3c,
    description: 'A booster pack from the Genesis TCG Dragon Realms set.',
    textureKey: 'product-dragon-booster',
  },
  {
    id: 'ocean-booster',
    name: 'Genesis: Ocean Legends',
    category: 'booster',
    costPrice: 2,
    sellPrice: 4,
    color: 0x3498db,
    description: 'A booster pack from the Genesis TCG Ocean Legends set.',
    textureKey: 'product-ocean-booster',
  },
  {
    id: 'forest-booster',
    name: 'Genesis: Forest Spirits',
    category: 'booster',
    costPrice: 2,
    sellPrice: 4,
    color: 0x2ecc71,
    description: 'A booster pack from the Genesis TCG Forest Spirits set.',
    textureKey: 'product-forest-booster',
  },
  {
    id: 'starter-deck',
    name: 'Genesis Starter Deck',
    category: 'deck',
    costPrice: 8,
    sellPrice: 15,
    color: 0xf39c12,
    description: 'A ready-to-play Genesis TCG starter deck for beginners.',
    textureKey: 'product-starter-deck',
  },
  {
    id: 'elite-box',
    name: 'Genesis Elite Trainer Box',
    category: 'box',
    costPrice: 25,
    sellPrice: 45,
    color: 0x9b59b6,
    description: 'A premium box with boosters, sleeves and more.',
    textureKey: 'product-elite-box',
  },
  {
    id: 'card-sleeves',
    name: 'Genesis Card Sleeves (50)',
    category: 'accessories',
    costPrice: 2,
    sellPrice: 5,
    color: 0x1abc9c,
    description: 'Protective sleeves to keep cards safe.',
    textureKey: 'product-card-sleeves',
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
