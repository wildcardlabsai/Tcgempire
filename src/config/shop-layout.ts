export const SHOP = {
  width: 480,
  height: 854,
  wallThickness: 8,
  floorColor: 0xc4a87c,
  wallColor: 0x2c2c4a,
  accentColor: 0xd4a854,
};

export interface FurnitureItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: number;
  label: string;
  interactionMessage: string;
}

export const FURNITURE: FurnitureItem[] = [
  {
    id: 'counter',
    x: 240,
    y: 115,
    width: 180,
    height: 50,
    color: 0x5c3a1e,
    label: 'Checkout',
    interactionMessage: 'Checkout — Serve customers here.',
  },
  {
    id: 'shelf-left',
    x: 65,
    y: 260,
    width: 70,
    height: 80,
    color: 0x5c4033,
    label: 'Boosters',
    interactionMessage: 'Stock Shelf — Place booster packs for sale.',
  },
  {
    id: 'shelf-right',
    x: 415,
    y: 260,
    width: 70,
    height: 80,
    color: 0x5c4033,
    label: 'Decks',
    interactionMessage: 'Stock Shelf — Place decks for sale.',
  },
  {
    id: 'shelf-center',
    x: 240,
    y: 340,
    width: 90,
    height: 70,
    color: 0x5c4033,
    label: 'New Releases',
    interactionMessage: 'Stock Shelf — Place new releases for sale.',
  },
  {
    id: 'computer',
    x: 340,
    y: 120,
    width: 40,
    height: 30,
    color: 0x3a3a5c,
    label: 'PC',
    interactionMessage: 'Shop Computer — Manage orders and prices.',
  },
  {
    id: 'storage',
    x: 60,
    y: 120,
    width: 55,
    height: 60,
    color: 0x5c4a3a,
    label: 'Storage',
    interactionMessage: 'Storage — Your stock reserve.',
  },
];

export const DOOR = {
  x: 240,
  y: 846,
  width: 80,
  height: 16,
  color: 0x4a7a5a,
};

export const PLAYER_START = {
  x: 240,
  y: 600,
};

const COLLISION_PADDING = 4;

export function collidesWithFurniture(x: number, y: number, halfW: number, halfH: number): boolean {
  for (const f of FURNITURE) {
    const fl = f.x - f.width / 2 - COLLISION_PADDING;
    const fr = f.x + f.width / 2 + COLLISION_PADDING;
    const ft = f.y - f.height / 2 - COLLISION_PADDING;
    const fb = f.y + f.height / 2 + COLLISION_PADDING;

    if (x + halfW > fl && x - halfW < fr && y + halfH > ft && y - halfH < fb) {
      return true;
    }
  }
  return false;
}
