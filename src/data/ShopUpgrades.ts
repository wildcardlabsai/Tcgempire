export interface ShopLevelData {
  level: number;
  name: string;
  upgradeCost: number;
  maxCustomers: number;
  spawnMin: number;
  spawnMax: number;
  customerPatience: number;
  description: string;
}

export const SHOP_LEVELS: ShopLevelData[] = [
  {
    level: 1,
    name: 'Starter Shop',
    upgradeCost: 0,
    maxCustomers: 4,
    spawnMin: 4000,
    spawnMax: 10000,
    customerPatience: 15,
    description: 'A humble card shop just getting started.',
  },
  {
    level: 2,
    name: 'Growing Business',
    upgradeCost: 500,
    maxCustomers: 6,
    spawnMin: 3500,
    spawnMax: 8000,
    customerPatience: 18,
    description: 'Word is spreading about your shop!',
  },
  {
    level: 3,
    name: 'Popular Store',
    upgradeCost: 1500,
    maxCustomers: 8,
    spawnMin: 3000,
    spawnMax: 7000,
    customerPatience: 22,
    description: 'Customers love the selection and service.',
  },
  {
    level: 4,
    name: 'TCG Destination',
    upgradeCost: 4000,
    maxCustomers: 10,
    spawnMin: 2500,
    spawnMax: 6000,
    customerPatience: 25,
    description: 'People travel from afar to visit your shop.',
  },
  {
    level: 5,
    name: 'Card Empire',
    upgradeCost: 10000,
    maxCustomers: 12,
    spawnMin: 2000,
    spawnMax: 5000,
    customerPatience: 30,
    description: 'The ultimate trading card empire!',
  },
];

export function getShopLevel(level: number): ShopLevelData {
  return SHOP_LEVELS[Math.min(level - 1, SHOP_LEVELS.length - 1)];
}

export function getNextUpgrade(level: number): ShopLevelData | null {
  if (level >= SHOP_LEVELS.length) return null;
  return SHOP_LEVELS[level];
}
