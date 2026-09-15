export type Rarity = 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'secret';

export interface Card {
  id: string;
  name: string;
  set: string;
  rarity: Rarity;
  color: number;
  value: number;
  description: string;
}

export const RARITY_COLORS: Record<Rarity, number> = {
  'common': 0x95a5a6,
  'uncommon': 0x27ae60,
  'rare': 0x2980b9,
  'ultra-rare': 0xe67e22,
  'secret': 0xe74c3c,
};

export const RARITY_LABELS: Record<Rarity, string> = {
  'common': 'Common',
  'uncommon': 'Uncommon',
  'rare': 'Rare',
  'ultra-rare': 'Ultra Rare',
  'secret': 'Secret Rare',
};

const DRAGON_REALMS: Card[] = [
  { id: 'dr-001', name: 'Ember Hatchling', set: 'Dragon Realms', rarity: 'common', color: 0xe74c3c, value: 0.2, description: 'A small dragon learning to breathe fire.' },
  { id: 'dr-002', name: 'Scale Shield', set: 'Dragon Realms', rarity: 'common', color: 0xe74c3c, value: 0.2, description: 'A shield made from shed dragon scales.' },
  { id: 'dr-003', name: 'Flame Wisp', set: 'Dragon Realms', rarity: 'common', color: 0xe74c3c, value: 0.2, description: 'A tiny fire spirit that follows dragons.' },
  { id: 'dr-004', name: 'Lava Pools', set: 'Dragon Realms', rarity: 'common', color: 0xe74c3c, value: 0.2, description: 'Bubbling pools where dragons like to bathe.' },
  { id: 'dr-005', name: 'Dragon Rider', set: 'Dragon Realms', rarity: 'uncommon', color: 0xe74c3c, value: 0.5, description: 'A brave warrior who has bonded with a dragon.' },
  { id: 'dr-006', name: 'Ash Storm', set: 'Dragon Realms', rarity: 'uncommon', color: 0xe74c3c, value: 0.5, description: 'A storm of cinders that heralds a dragon attack.' },
  { id: 'dr-007', name: 'Crimson Wyrm', set: 'Dragon Realms', rarity: 'rare', color: 0xe74c3c, value: 2, description: 'An ancient red dragon of immense power.' },
  { id: 'dr-008', name: 'Inferno Drake', set: 'Dragon Realms', rarity: 'ultra-rare', color: 0xe74c3c, value: 8, description: 'A legendary drake wreathed in eternal flame.' },
  { id: 'dr-009', name: 'Volcanic Overlord', set: 'Dragon Realms', rarity: 'secret', color: 0xe74c3c, value: 25, description: 'The supreme ruler of all dragonkind.' },
];

const OCEAN_LEGENDS: Card[] = [
  { id: 'ol-001', name: 'Bubble Fish', set: 'Ocean Legends', rarity: 'common', color: 0x3498db, value: 0.2, description: 'A cheerful fish that blows bubbles.' },
  { id: 'ol-002', name: 'Coral Guardian', set: 'Ocean Legends', rarity: 'common', color: 0x3498db, value: 0.2, description: 'A crab that protects the reef.' },
  { id: 'ol-003', name: 'Tide Pool', set: 'Ocean Legends', rarity: 'common', color: 0x3498db, value: 0.2, description: 'A magical pool that reveals the future.' },
  { id: 'ol-004', name: 'Pearl Diver', set: 'Ocean Legends', rarity: 'common', color: 0x3498db, value: 0.2, description: 'A skilled diver searching for treasures.' },
  { id: 'ol-005', name: 'Storm Seahorse', set: 'Ocean Legends', rarity: 'uncommon', color: 0x3498db, value: 0.5, description: 'A seahorse that can summon lightning.' },
  { id: 'ol-006', name: 'Whirlpool Mage', set: 'Ocean Legends', rarity: 'uncommon', color: 0x3498db, value: 0.5, description: 'A sorcerer who commands the currents.' },
  { id: 'ol-007', name: 'Abyssal Serpent', set: 'Ocean Legends', rarity: 'rare', color: 0x3498db, value: 2, description: 'A massive sea serpent from the deep.' },
  { id: 'ol-008', name: 'Tidal Leviathan', set: 'Ocean Legends', rarity: 'ultra-rare', color: 0x3498db, value: 8, description: 'A colossal sea beast that controls the tides.' },
  { id: 'ol-009', name: 'Poseidon\'s Trident', set: 'Ocean Legends', rarity: 'secret', color: 0x3498db, value: 25, description: 'The legendary weapon of the sea god.' },
];

const FOREST_SPIRITS: Card[] = [
  { id: 'fs-001', name: 'Leaf Sprite', set: 'Forest Spirits', rarity: 'common', color: 0x2ecc71, value: 0.2, description: 'A tiny spirit that lives among the leaves.' },
  { id: 'fs-002', name: 'Mushroom Cap', set: 'Forest Spirits', rarity: 'common', color: 0x2ecc71, value: 0.2, description: 'A magical mushroom with healing properties.' },
  { id: 'fs-003', name: 'Twig Runner', set: 'Forest Spirits', rarity: 'common', color: 0x2ecc71, value: 0.2, description: 'A creature made of sticks that scurries about.' },
  { id: 'fs-004', name: 'Moss Golem', set: 'Forest Spirits', rarity: 'common', color: 0x2ecc71, value: 0.2, description: 'A slow but sturdy guardian of the woods.' },
  { id: 'fs-005', name: 'Vine Whip', set: 'Forest Spirits', rarity: 'uncommon', color: 0x2ecc71, value: 0.5, description: 'Enchanted vines that strike with precision.' },
  { id: 'fs-006', name: 'Owl Sage', set: 'Forest Spirits', rarity: 'uncommon', color: 0x2ecc71, value: 0.5, description: 'A wise owl who knows ancient forest magic.' },
  { id: 'fs-007', name: 'Ancient Treant', set: 'Forest Spirits', rarity: 'rare', color: 0x2ecc71, value: 2, description: 'A towering tree that has come to life.' },
  { id: 'fs-008', name: 'Emerald Stag', set: 'Forest Spirits', rarity: 'ultra-rare', color: 0x2ecc71, value: 8, description: 'A radiant stag whose antlers glow with power.' },
  { id: 'fs-009', name: 'World Tree', set: 'Forest Spirits', rarity: 'secret', color: 0x2ecc71, value: 25, description: 'The source of all life in the forest.' },
];

export const ALL_CARDS: Card[] = [...DRAGON_REALMS, ...OCEAN_LEGENDS, ...FOREST_SPIRITS];

export const SETS: Record<string, Card[]> = {
  'Dragon Realms': DRAGON_REALMS,
  'Ocean Legends': OCEAN_LEGENDS,
  'Forest Spirits': FOREST_SPIRITS,
};

export const BOOSTER_TO_SET: Record<string, string> = {
  'dragon-booster': 'Dragon Realms',
  'ocean-booster': 'Ocean Legends',
  'forest-booster': 'Forest Spirits',
};

const RARITY_WEIGHTS: { rarity: Rarity; weight: number }[] = [
  { rarity: 'common', weight: 60 },
  { rarity: 'uncommon', weight: 25 },
  { rarity: 'rare', weight: 10 },
  { rarity: 'ultra-rare', weight: 4 },
  { rarity: 'secret', weight: 1 },
];

function pickRarity(): Rarity {
  const total = RARITY_WEIGHTS.reduce((sum, w) => sum + w.weight, 0);
  let roll = Math.random() * total;
  for (const { rarity, weight } of RARITY_WEIGHTS) {
    roll -= weight;
    if (roll <= 0) return rarity;
  }
  return 'common';
}

export function openBoosterPack(setName: string): Card[] {
  const setCards = SETS[setName];
  if (!setCards) return [];

  const pulled: Card[] = [];
  for (let i = 0; i < 5; i++) {
    const rarity = pickRarity();
    const candidates = setCards.filter((c) => c.rarity === rarity);
    if (candidates.length > 0) {
      pulled.push(candidates[Math.floor(Math.random() * candidates.length)]);
    } else {
      const commons = setCards.filter((c) => c.rarity === 'common');
      pulled.push(commons[Math.floor(Math.random() * commons.length)]);
    }
  }
  return pulled;
}
