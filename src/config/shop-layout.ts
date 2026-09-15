export const SHOP = {
  width: 640,
  height: 480,
  wallThickness: 16,
  floorColor: 0xf5e6d0,
  wallColor: 0x8b7355,
  accentColor: 0xc4956a,
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
    x: 400,
    y: 140,
    width: 160,
    height: 48,
    color: 0x6b4226,
    label: 'Counter',
    interactionMessage: 'Checkout — Serve customers here.',
  },
  {
    id: 'shelf-left',
    x: 80,
    y: 100,
    width: 64,
    height: 180,
    color: 0x8b6914,
    label: 'Shelf',
    interactionMessage: 'Stock Shelf — Place products for sale.',
  },
  {
    id: 'shelf-right',
    x: 560,
    y: 100,
    width: 64,
    height: 180,
    color: 0x8b6914,
    label: 'Shelf',
    interactionMessage: 'Stock Shelf — Place products for sale.',
  },
  {
    id: 'computer',
    x: 480,
    y: 420,
    width: 56,
    height: 48,
    color: 0x2c2c54,
    label: 'PC',
    interactionMessage: 'Shop Computer — Manage orders and prices.',
  },
  {
    id: 'storage',
    x: 80,
    y: 400,
    width: 80,
    height: 56,
    color: 0x7b6b5a,
    label: 'Storage',
    interactionMessage: 'Storage — Your stock reserve.',
  },
];

export const DOOR = {
  x: 320,
  y: 480 - 8,
  width: 80,
  height: 16,
  color: 0x5a8a5a,
};

export const PLAYER_START = {
  x: 320,
  y: 360,
};
