export type Element = 'fire' | 'water' | 'nature' | 'shadow' | 'light' | 'arcane';

export type Rarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'double-rare'
  | 'ultra-rare'
  | 'illustration-rare'
  | 'special-illustration-rare'
  | 'secret-rare'
  | 'hyper-rare'
  | 'golden-crown';

export interface Card {
  id: string;
  name: string;
  cardNumber: string;
  set: string;
  rarity: Rarity;
  element: Element;
  type: string;
  description: string;
  ability: string;
  hp: number;
  attack: number;
  value: number;
  artSeed: number;
}

export const ELEMENT_COLORS: Record<Element, { primary: number; secondary: number; accent: number }> = {
  fire: { primary: 0xcc3322, secondary: 0xff6600, accent: 0xffd700 },
  water: { primary: 0x1a5276, secondary: 0x2e86c1, accent: 0x87ceeb },
  nature: { primary: 0x1e7a3a, secondary: 0x28b463, accent: 0x90ee90 },
  shadow: { primary: 0x2c1654, secondary: 0x6c3483, accent: 0xbb8fce },
  light: { primary: 0x7d6608, secondary: 0xd4ac0d, accent: 0xfef9e7 },
  arcane: { primary: 0x1a237e, secondary: 0x5c6bc0, accent: 0xb39ddb },
};

export const RARITY_COLORS: Record<Rarity, number> = {
  common: 0x95a5a6,
  uncommon: 0x27ae60,
  rare: 0x2980b9,
  'double-rare': 0x8e44ad,
  'ultra-rare': 0xe67e22,
  'illustration-rare': 0xe74c3c,
  'special-illustration-rare': 0xc0392b,
  'secret-rare': 0xf1c40f,
  'hyper-rare': 0xe91e63,
  'golden-crown': 0xffd700,
};

export const RARITY_LABELS: Record<Rarity, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  'double-rare': 'Double Rare',
  'ultra-rare': 'Ultra Rare',
  'illustration-rare': 'Illustration Rare',
  'special-illustration-rare': 'Special Illustration Rare',
  'secret-rare': 'Secret Rare',
  'hyper-rare': 'Hyper Rare',
  'golden-crown': 'Golden Crown',
};

export const RARITY_SYMBOLS: Record<Rarity, string> = {
  common: '●',
  uncommon: '◆',
  rare: '★',
  'double-rare': '★★',
  'ultra-rare': '✦',
  'illustration-rare': '✧',
  'special-illustration-rare': '✧✧',
  'secret-rare': '◈',
  'hyper-rare': '⬡',
  'golden-crown': '♛',
};

function card(
  id: string, num: number, name: string, set: string, rarity: Rarity,
  element: Element, type: string, description: string, ability: string,
  hp: number, attack: number, value: number
): Card {
  return {
    id,
    name,
    cardNumber: `${String(num).padStart(3, '0')}/050`,
    set,
    rarity,
    element,
    type,
    description,
    ability,
    hp,
    attack,
    value,
    artSeed: num * 7919 + id.charCodeAt(4) * 31,
  };
}

const FLAME_AWAKENING: Card[] = [
  card('GEN-001', 1, 'Cinder Pup', 'Flame Awakening', 'common', 'fire', 'Creature', 'A small fire hound that sparks when excited.', 'Spark Bite', 40, 20, 0.15),
  card('GEN-002', 2, 'Ember Wisp', 'Flame Awakening', 'common', 'fire', 'Spirit', 'A flickering spirit born from dying campfires.', 'Flicker', 30, 15, 0.15),
  card('GEN-003', 3, 'Magma Salamander', 'Flame Awakening', 'common', 'fire', 'Creature', 'Dwells in volcanic vents, its skin glows hot.', 'Lava Trail', 50, 25, 0.15),
  card('GEN-004', 4, 'Ash Veil', 'Flame Awakening', 'common', 'fire', 'Spell', 'A curtain of smouldering ash blinds the foe.', 'Obscure', 0, 30, 0.15),
  card('GEN-005', 5, 'Forge Acolyte', 'Flame Awakening', 'uncommon', 'fire', 'Creature', 'An apprentice smith wielding molten tongs.', 'Tempered Strike', 60, 35, 0.40),
  card('GEN-006', 6, 'Pyroclast Elemental', 'Flame Awakening', 'uncommon', 'fire', 'Elemental', 'A living column of volcanic glass and flame.', 'Eruption Slam', 70, 40, 0.40),
  card('GEN-007', 7, 'Ignis Drake', 'Flame Awakening', 'rare', 'fire', 'Dragon', 'A swift drake whose wingbeats fan firestorms.', 'Inferno Dive', 90, 55, 2.00),
  card('GEN-008', 8, 'Solara, Phoenix Ascendant', 'Flame Awakening', 'ultra-rare', 'fire', 'Legendary', 'Reborn from ashes, she blazes across the sky.', 'Rebirth Blaze', 120, 70, 8.00),
  card('GEN-009', 9, 'Volcrath, Worldforge Titan', 'Flame Awakening', 'secret-rare', 'fire', 'Titan', 'His hammer strikes forge new continents.', 'Continental Smash', 160, 90, 30.00),
];

const TIDAL_FORCES: Card[] = [
  card('GEN-010', 10, 'Coral Guppy', 'Tidal Forces', 'common', 'water', 'Creature', 'A bright fish that hides among the reefs.', 'Bubble Pop', 35, 15, 0.15),
  card('GEN-011', 11, 'Tide Crab', 'Tidal Forces', 'common', 'water', 'Creature', 'Its shell is harder than barnacle-covered stone.', 'Pinch Guard', 50, 20, 0.15),
  card('GEN-012', 12, 'Ripple Dancer', 'Tidal Forces', 'common', 'water', 'Spirit', 'A shimmering spirit that skips across the waves.', 'Wave Step', 30, 20, 0.15),
  card('GEN-013', 13, 'Sea Mist', 'Tidal Forces', 'uncommon', 'water', 'Spell', 'A rolling fog that confuses approaching enemies.', 'Fog Cloak', 0, 25, 0.40),
  card('GEN-014', 14, 'Storm Seahorse', 'Tidal Forces', 'uncommon', 'water', 'Creature', 'Channels lightning through its curved horn.', 'Thunder Jet', 60, 40, 0.40),
  card('GEN-015', 15, 'Whirlpool Mage', 'Tidal Forces', 'rare', 'water', 'Creature', 'Commands the spiralling currents of the deep.', 'Vortex Bind', 80, 50, 2.00),
  card('GEN-016', 16, 'Abyssal Serpent', 'Tidal Forces', 'double-rare', 'water', 'Creature', 'A colossal sea serpent that dwells in total darkness.', 'Depth Crush', 110, 65, 5.00),
  card('GEN-017', 17, 'Nerissa, Tide Empress', 'Tidal Forces', 'ultra-rare', 'water', 'Legendary', 'The ocean bends to her will.', 'Tidal Dominion', 130, 75, 8.00),
];

const NATURE_RISING: Card[] = [
  card('GEN-018', 18, 'Leaf Sprite', 'Nature Rising', 'common', 'nature', 'Spirit', 'A tiny spirit that dances among the canopy.', 'Petal Toss', 30, 15, 0.15),
  card('GEN-019', 19, 'Thorn Beetle', 'Nature Rising', 'common', 'nature', 'Creature', 'Its back bristles with poisonous quills.', 'Quill Jab', 45, 25, 0.15),
  card('GEN-020', 20, 'Moss Golem', 'Nature Rising', 'common', 'nature', 'Construct', 'A slow guardian grown from ancient stone and roots.', 'Root Slam', 70, 20, 0.15),
  card('GEN-021', 21, 'Vine Whip', 'Nature Rising', 'uncommon', 'nature', 'Spell', 'Enchanted tendrils that lash with precision.', 'Entangle', 0, 35, 0.40),
  card('GEN-022', 22, 'Owl Sage', 'Nature Rising', 'uncommon', 'nature', 'Creature', 'A wise owl steeped in ancient forest magic.', 'Wisdom Gaze', 55, 30, 0.40),
  card('GEN-023', 23, 'Ancient Treant', 'Nature Rising', 'rare', 'nature', 'Creature', 'A towering tree that awakened after centuries.', 'Canopy Crush', 100, 45, 2.00),
  card('GEN-024', 24, 'Emerald Stag', 'Nature Rising', 'double-rare', 'nature', 'Legendary', 'Its crystalline antlers channel pure life force.', 'Verdant Charge', 110, 60, 5.00),
  card('GEN-025', 25, 'Gaia, World Root', 'Nature Rising', 'illustration-rare', 'nature', 'Titan', 'The living heart of every forest.', 'Genesis Bloom', 150, 80, 15.00),
];

const SHADOW_REALM: Card[] = [
  card('GEN-026', 26, 'Shade Imp', 'Shadow Realm', 'common', 'shadow', 'Creature', 'A mischievous imp that feeds on fear.', 'Dread Scratch', 35, 20, 0.15),
  card('GEN-027', 27, 'Gloom Bat', 'Shadow Realm', 'common', 'shadow', 'Creature', 'Echolocates through dimensions of darkness.', 'Sonic Shriek', 30, 25, 0.15),
  card('GEN-028', 28, 'Void Tendril', 'Shadow Realm', 'common', 'shadow', 'Spell', 'A tentacle of pure nothingness that drains energy.', 'Siphon', 0, 30, 0.15),
  card('GEN-029', 29, 'Nightmare Stalker', 'Shadow Realm', 'uncommon', 'shadow', 'Creature', 'It hunts within the dreams of the sleeping.', 'Fear Strike', 60, 40, 0.40),
  card('GEN-030', 30, 'Eclipse Wraith', 'Shadow Realm', 'uncommon', 'shadow', 'Spirit', 'Appears only when the sun hides its face.', 'Penumbra Slash', 55, 45, 0.40),
  card('GEN-031', 31, 'Obsidian Knight', 'Shadow Realm', 'rare', 'shadow', 'Creature', 'An armoured warrior forged from crystallised darkness.', 'Dark Rend', 90, 55, 2.00),
  card('GEN-032', 32, 'Noctis, Lord of Whispers', 'Shadow Realm', 'ultra-rare', 'shadow', 'Legendary', 'His whispers unmake the bravest heroes.', 'Silence Eternal', 130, 70, 8.00),
  card('GEN-033', 33, 'Erebus, Void Sovereign', 'Shadow Realm', 'hyper-rare', 'shadow', 'Titan', 'The darkness between stars given form.', 'Annihilate', 170, 95, 40.00),
];

const CELESTIAL_LIGHT: Card[] = [
  card('GEN-034', 34, 'Dawn Sprite', 'Celestial Light', 'common', 'light', 'Spirit', 'A tiny radiant being that heralds the sunrise.', 'Morning Glow', 30, 15, 0.15),
  card('GEN-035', 35, 'Shield Acolyte', 'Celestial Light', 'common', 'light', 'Creature', 'A devoted guardian who channels holy light.', 'Barrier', 55, 20, 0.15),
  card('GEN-036', 36, 'Prismatic Fox', 'Celestial Light', 'common', 'light', 'Creature', 'Its rainbow fur deflects harmful magic.', 'Refract', 40, 25, 0.15),
  card('GEN-037', 37, 'Radiant Heal', 'Celestial Light', 'uncommon', 'light', 'Spell', 'A warm pulse of energy that mends wounds.', 'Restore 30', 0, 0, 0.40),
  card('GEN-038', 38, 'Gryphon Sentinel', 'Celestial Light', 'uncommon', 'light', 'Creature', 'Guards the skyward gates with unwavering loyalty.', 'Talon Dive', 70, 40, 0.40),
  card('GEN-039', 39, 'Seraphic Warden', 'Celestial Light', 'rare', 'light', 'Creature', 'A winged protector wreathed in golden light.', 'Holy Smite', 90, 50, 2.00),
  card('GEN-040', 40, 'Aurelius, Sun Herald', 'Celestial Light', 'ultra-rare', 'light', 'Legendary', 'His arrival turns night into blazing noon.', 'Solar Wrath', 130, 75, 8.00),
  card('GEN-041', 41, 'Lumina, Eternal Radiance', 'Celestial Light', 'special-illustration-rare', 'light', 'Titan', 'The first light ever kindled.', 'Supernova', 160, 85, 25.00),
];

const ANCIENT_POWER: Card[] = [
  card('GEN-042', 42, 'Rune Scarab', 'Ancient Power', 'common', 'arcane', 'Creature', 'A beetle whose carapace is etched with spells.', 'Glyph Bite', 40, 20, 0.15),
  card('GEN-043', 43, 'Spell Fragment', 'Ancient Power', 'common', 'arcane', 'Spell', 'A shard of a forgotten incantation.', 'Arcane Pulse', 0, 25, 0.15),
  card('GEN-044', 44, 'Crystal Golem', 'Ancient Power', 'common', 'arcane', 'Construct', 'Animated by ley-line energy trapped in quartz.', 'Prism Slam', 60, 20, 0.15),
  card('GEN-045', 45, 'Ley Weaver', 'Ancient Power', 'uncommon', 'arcane', 'Creature', 'She braids raw magical energy into tangible form.', 'Thread Bind', 50, 35, 0.40),
  card('GEN-046', 46, 'Chrono Sphinx', 'Ancient Power', 'uncommon', 'arcane', 'Creature', 'Asks riddles that bend time itself.', 'Temporal Riddle', 70, 30, 0.40),
  card('GEN-047', 47, 'Aether Dragon', 'Ancient Power', 'rare', 'arcane', 'Dragon', 'Flies through the spaces between realities.', 'Dimensional Breath', 100, 55, 2.00),
  card('GEN-048', 48, 'Nexus Guardian', 'Ancient Power', 'double-rare', 'arcane', 'Legendary', 'Protects the convergence of all ley lines.', 'Mana Surge', 120, 65, 5.00),
  card('GEN-049', 49, 'Archon, Primordial Sage', 'Ancient Power', 'secret-rare', 'arcane', 'Titan', 'The first being to harness raw creation.', 'Genesis Wave', 150, 85, 30.00),
  card('GEN-050', 50, 'Chronos, Epoch Weaver', 'Ancient Power', 'golden-crown', 'arcane', 'Deity', 'Exists at the beginning and end of all things.', 'Eternity', 200, 100, 100.00),
];

export const ALL_CARDS: Card[] = [
  ...FLAME_AWAKENING,
  ...TIDAL_FORCES,
  ...NATURE_RISING,
  ...SHADOW_REALM,
  ...CELESTIAL_LIGHT,
  ...ANCIENT_POWER,
];

export const SET_NAMES = [
  'Flame Awakening',
  'Tidal Forces',
  'Nature Rising',
  'Shadow Realm',
  'Celestial Light',
  'Ancient Power',
] as const;

export const SETS: Record<string, Card[]> = {
  'Flame Awakening': FLAME_AWAKENING,
  'Tidal Forces': TIDAL_FORCES,
  'Nature Rising': NATURE_RISING,
  'Shadow Realm': SHADOW_REALM,
  'Celestial Light': CELESTIAL_LIGHT,
  'Ancient Power': ANCIENT_POWER,
};

export const SET_ELEMENTS: Record<string, Element> = {
  'Flame Awakening': 'fire',
  'Tidal Forces': 'water',
  'Nature Rising': 'nature',
  'Shadow Realm': 'shadow',
  'Celestial Light': 'light',
  'Ancient Power': 'arcane',
};

export const BOOSTER_TO_SET: Record<string, string> = {
  'flame-booster': 'Flame Awakening',
  'tidal-booster': 'Tidal Forces',
  'nature-booster': 'Nature Rising',
  'shadow-booster': 'Shadow Realm',
  'celestial-booster': 'Celestial Light',
  'ancient-booster': 'Ancient Power',
};

const RARITY_WEIGHTS: { rarity: Rarity; weight: number }[] = [
  { rarity: 'common', weight: 50 },
  { rarity: 'uncommon', weight: 25 },
  { rarity: 'rare', weight: 12 },
  { rarity: 'double-rare', weight: 5 },
  { rarity: 'ultra-rare', weight: 3 },
  { rarity: 'illustration-rare', weight: 2 },
  { rarity: 'special-illustration-rare', weight: 1 },
  { rarity: 'secret-rare', weight: 1 },
  { rarity: 'hyper-rare', weight: 0.5 },
  { rarity: 'golden-crown', weight: 0.1 },
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
  for (let i = 0; i < 10; i++) {
    const rarity = i < 7 ? pickRarity() : (i === 9 ? pickGuaranteedRare() : pickRarity());
    let candidates = setCards.filter((c) => c.rarity === rarity);
    if (candidates.length === 0) {
      candidates = ALL_CARDS.filter((c) => c.rarity === rarity);
    }
    if (candidates.length === 0) {
      candidates = setCards.filter((c) => c.rarity === 'common');
    }
    pulled.push(candidates[Math.floor(Math.random() * candidates.length)]);
  }
  return pulled;
}

function pickGuaranteedRare(): Rarity {
  const rareAndAbove: { rarity: Rarity; weight: number }[] = RARITY_WEIGHTS.filter(
    (w) => w.rarity !== 'common' && w.rarity !== 'uncommon'
  );
  const total = rareAndAbove.reduce((sum, w) => sum + w.weight, 0);
  let roll = Math.random() * total;
  for (const { rarity, weight } of rareAndAbove) {
    roll -= weight;
    if (roll <= 0) return rarity;
  }
  return 'rare';
}

export function getCardById(id: string): Card | undefined {
  return ALL_CARDS.find((c) => c.id === id);
}
