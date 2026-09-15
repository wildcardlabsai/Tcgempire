import { PRODUCTS, Product } from './Products';

export interface StockEntry {
  productId: string;
  quantity: number;
}

class InventoryManager {
  private storage: Map<string, number> = new Map();
  private shelves: Map<string, number> = new Map();

  constructor() {
    this.reset();
  }

  reset(): void {
    this.storage.clear();
    this.shelves.clear();
    this.storage.set('dragon-booster', 10);
    this.storage.set('ocean-booster', 10);
    this.storage.set('forest-booster', 5);
    this.storage.set('starter-deck', 3);
    this.storage.set('card-sleeves', 10);
  }

  getStorageQuantity(productId: string): number {
    return this.storage.get(productId) ?? 0;
  }

  getShelfQuantity(productId: string): number {
    return this.shelves.get(productId) ?? 0;
  }

  getTotalQuantity(productId: string): number {
    return this.getStorageQuantity(productId) + this.getShelfQuantity(productId);
  }

  addToStorage(productId: string, qty: number): void {
    const current = this.getStorageQuantity(productId);
    this.storage.set(productId, current + qty);
  }

  moveToShelf(productId: string, qty: number): boolean {
    const inStorage = this.getStorageQuantity(productId);
    const toMove = Math.min(qty, inStorage);
    if (toMove <= 0) return false;

    this.storage.set(productId, inStorage - toMove);
    const onShelf = this.getShelfQuantity(productId);
    this.shelves.set(productId, onShelf + toMove);
    return true;
  }

  sellFromShelf(productId: string, qty: number): boolean {
    const onShelf = this.getShelfQuantity(productId);
    if (onShelf < qty) return false;
    this.shelves.set(productId, onShelf - qty);
    return true;
  }

  getShelfProducts(): { product: Product; quantity: number }[] {
    const result: { product: Product; quantity: number }[] = [];
    for (const p of PRODUCTS) {
      const qty = this.getShelfQuantity(p.id);
      if (qty > 0) {
        result.push({ product: p, quantity: qty });
      }
    }
    return result;
  }

  getStorageProducts(): { product: Product; quantity: number }[] {
    const result: { product: Product; quantity: number }[] = [];
    for (const p of PRODUCTS) {
      const qty = this.getStorageQuantity(p.id);
      if (qty > 0) {
        result.push({ product: p, quantity: qty });
      }
    }
    return result;
  }

  hasAnyShelfStock(): boolean {
    for (const qty of this.shelves.values()) {
      if (qty > 0) return true;
    }
    return false;
  }

  getRandomShelfProduct(): { product: Product; quantity: number } | null {
    const available = this.getShelfProducts();
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
  }

  removeFromStorage(productId: string, qty: number): boolean {
    const inStorage = this.getStorageQuantity(productId);
    if (inStorage < qty) return false;
    this.storage.set(productId, inStorage - qty);
    return true;
  }

  serialize(): { storage: Record<string, number>; shelves: Record<string, number> } {
    const storage: Record<string, number> = {};
    const shelves: Record<string, number> = {};
    for (const [id, qty] of this.storage.entries()) {
      if (qty > 0) storage[id] = qty;
    }
    for (const [id, qty] of this.shelves.entries()) {
      if (qty > 0) shelves[id] = qty;
    }
    return { storage, shelves };
  }

  deserialize(data: { storage: Record<string, number>; shelves: Record<string, number> }): void {
    this.storage.clear();
    this.shelves.clear();
    for (const [id, qty] of Object.entries(data.storage)) {
      this.storage.set(id, qty);
    }
    for (const [id, qty] of Object.entries(data.shelves)) {
      this.shelves.set(id, qty);
    }
  }
}

export const Inventory = new InventoryManager();
