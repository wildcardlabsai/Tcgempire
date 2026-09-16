export const SHOP = {
  width: 800,
  height: 600,
  wallThickness: 16,
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
    x: 530,
    y: 300,
    width: 200,
    height: 50,
    color: 0x5c3a1e,
    label: 'Checkout',
    interactionMessage: 'Checkout — Serve customers here.',
  },
  {
    id: 'shelf-left',
    x: 270,
    y: 75,
    width: 240,
    height: 65,
    color: 0x5c4033,
    label: 'Shelf',
    interactionMessage: 'Stock Shelf — Place products for sale.',
  },
  {
    id: 'shelf-right',
    x: 580,
    y: 75,
    width: 220,
    height: 65,
    color: 0x5c4033,
    label: 'Shelf',
    interactionMessage: 'Stock Shelf — Place products for sale.',
  },
  {
    id: 'computer',
    x: 690,
    y: 510,
    width: 80,
    height: 60,
    color: 0x3a3a5c,
    label: 'PC',
    interactionMessage: 'Shop Computer — Manage orders and prices.',
  },
  {
    id: 'storage',
    x: 80,
    y: 110,
    width: 90,
    height: 100,
    color: 0x5c4a3a,
    label: 'Storage',
    interactionMessage: 'Storage — Your stock reserve.',
  },
];

export const DOOR = {
  x: 400,
  y: 600 - 8,
  width: 100,
  height: 16,
  color: 0x4a7a5a,
};

export const PLAYER_START = {
  x: 400,
  y: 420,
};
