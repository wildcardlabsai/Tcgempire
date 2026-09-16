export interface DecorationDef {
  id: string;
  name: string;
  cost: number;
  color: number;
  icon: string;
  width: number;
  height: number;
  attractionBonus: number;
  description: string;
  minLevel: number;
}

export const DECORATION_CATALOG: DecorationDef[] = [
  {
    id: 'poster-dragon',
    name: 'Dragon Poster',
    cost: 50,
    color: 0xe74c3c,
    icon: '🐉',
    width: 20,
    height: 28,
    attractionBonus: 0.03,
    description: 'A cool dragon poster for the wall.',
    minLevel: 1,
  },
  {
    id: 'poster-ocean',
    name: 'Ocean Poster',
    cost: 50,
    color: 0x3498db,
    icon: '🌊',
    width: 20,
    height: 28,
    attractionBonus: 0.03,
    description: 'A serene ocean-themed poster.',
    minLevel: 1,
  },
  {
    id: 'plant-small',
    name: 'Potted Plant',
    cost: 75,
    color: 0x27ae60,
    icon: '🌿',
    width: 16,
    height: 16,
    attractionBonus: 0.04,
    description: 'Adds a touch of nature.',
    minLevel: 1,
  },
  {
    id: 'rug-welcome',
    name: 'Welcome Rug',
    cost: 120,
    color: 0x8e44ad,
    icon: '🟪',
    width: 60,
    height: 30,
    attractionBonus: 0.05,
    description: 'A warm welcome for your customers.',
    minLevel: 2,
  },
  {
    id: 'display-case',
    name: 'Display Case',
    cost: 200,
    color: 0xf39c12,
    icon: '🏆',
    width: 32,
    height: 24,
    attractionBonus: 0.06,
    description: 'Show off rare cards in style.',
    minLevel: 2,
  },
  {
    id: 'neon-sign',
    name: 'Neon Sign',
    cost: 350,
    color: 0xff6bcb,
    icon: '💡',
    width: 40,
    height: 14,
    attractionBonus: 0.08,
    description: 'A glowing sign that draws attention.',
    minLevel: 3,
  },
  {
    id: 'plant-large',
    name: 'Large Plant',
    cost: 150,
    color: 0x2ecc71,
    icon: '🌳',
    width: 22,
    height: 22,
    attractionBonus: 0.05,
    description: 'A tall leafy plant in a nice pot.',
    minLevel: 2,
  },
  {
    id: 'card-banner',
    name: 'TCG Banner',
    cost: 500,
    color: 0xffd700,
    icon: '🏅',
    width: 48,
    height: 16,
    attractionBonus: 0.10,
    description: 'A golden banner celebrating card culture.',
    minLevel: 3,
  },
  {
    id: 'premium-flooring',
    name: 'Premium Mat',
    cost: 800,
    color: 0x1abc9c,
    icon: '✨',
    width: 80,
    height: 50,
    attractionBonus: 0.12,
    description: 'A luxurious floor mat for the entrance.',
    minLevel: 4,
  },
  {
    id: 'trophy-shelf',
    name: 'Trophy Shelf',
    cost: 1000,
    color: 0xe67e22,
    icon: '🏅',
    width: 36,
    height: 20,
    attractionBonus: 0.15,
    description: 'Show off your tournament victories.',
    minLevel: 5,
  },
];

export interface PlacedDecoration {
  id: string;
  x: number;
  y: number;
}

const PLACEMENT_SLOTS: { x: number; y: number }[] = [
  { x: 200, y: 200 },
  { x: 340, y: 200 },
  { x: 480, y: 200 },
  { x: 620, y: 200 },
  { x: 160, y: 350 },
  { x: 400, y: 380 },
  { x: 300, y: 460 },
  { x: 500, y: 460 },
  { x: 200, y: 530 },
  { x: 600, y: 530 },
];

class DecorationManager {
  private placed: PlacedDecoration[] = [];

  getPlaced(): PlacedDecoration[] {
    return [...this.placed];
  }

  getPlacedCount(): number {
    return this.placed.length;
  }

  hasDecoration(id: string): boolean {
    return this.placed.some(d => d.id === id);
  }

  canPlace(): boolean {
    return this.placed.length < PLACEMENT_SLOTS.length;
  }

  place(id: string): boolean {
    if (this.hasDecoration(id)) return false;
    if (!this.canPlace()) return false;
    const slot = PLACEMENT_SLOTS[this.placed.length];
    this.placed.push({ id, x: slot.x, y: slot.y });
    return true;
  }

  getAttractionBonus(): number {
    let bonus = 0;
    for (const p of this.placed) {
      const def = DECORATION_CATALOG.find(d => d.id === p.id);
      if (def) bonus += def.attractionBonus;
    }
    return bonus;
  }

  getRating(): number {
    const bonus = this.getAttractionBonus();
    const stars = Math.min(5, 1 + bonus * 5);
    return Math.round(stars * 10) / 10;
  }

  serialize(): PlacedDecoration[] {
    return [...this.placed];
  }

  deserialize(data: PlacedDecoration[]): void {
    this.placed = data || [];
  }

  reset(): void {
    this.placed = [];
  }
}

export const Decorations = new DecorationManager();
