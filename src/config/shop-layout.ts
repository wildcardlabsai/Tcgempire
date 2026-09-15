export const SHOP = {
  width: 800,
  height: 600,
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
    x: 500,
    y: 180,
    width: 180,
    height: 52,
    color: 0x6b4226,
    label: 'Counter',
    interactionMessage: 'Checkout — Serve customers here.',
  },
  {
    id: 'shelf-left',
    x: 90,
    y: 130,
    width: 72,
    height: 220,
    color: 0x8b6914,
    label: 'Shelf',
    interactionMessage: 'Stock Shelf — Place products for sale.',
  },
  {
    id: 'shelf-right',
    x: 710,
    y: 130,
    width: 72,
    height: 220,
    color: 0x8b6914,
    label: 'Shelf',
    interactionMessage: 'Stock Shelf — Place products for sale.',
  },
  {
    id: 'computer',
    x: 610,
    y: 530,
    width: 64,
    height: 52,
    color: 0x2c2c54,
    label: 'PC',
    interactionMessage: 'Shop Computer — Manage orders and prices.',
  },
  {
    id: 'storage',
    x: 90,
    y: 510,
    width: 96,
    height: 64,
    color: 0x7b6b5a,
    label: 'Storage',
    interactionMessage: 'Storage — Your stock reserve.',
  },
];

export const DOOR = {
  x: 400,
  y: 600 - 8,
  width: 100,
  height: 16,
  color: 0x5a8a5a,
};

export const PLAYER_START = {
  x: 400,
  y: 440,
};
