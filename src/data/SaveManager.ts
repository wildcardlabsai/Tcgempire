import { GameState } from './GameState';
import { Inventory } from './Inventory';
import { Collection } from './Collection';
import { PriceManager } from './PriceManager';

const SAVE_KEY = 'tcg-empire-save';

interface SaveData {
  version: number;
  gameState: {
    cash: number;
    shopLevel: number;
    day: number;
  };
  inventory: {
    storage: Record<string, number>;
    shelves: Record<string, number>;
  };
  collection: Record<string, number>;
  pricing: Record<string, number>;
  savedAt: number;
}

export class SaveManager {
  static save(): void {
    const data: SaveData = {
      version: 2,
      gameState: {
        cash: GameState.cash,
        shopLevel: GameState.shopLevel,
        day: GameState.day,
      },
      inventory: Inventory.serialize(),
      collection: Collection.serialize(),
      pricing: PriceManager.serialize(),
      savedAt: Date.now(),
    };

    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch {
      // Storage full or unavailable
    }
  }

  static load(): boolean {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;

      const data: SaveData = JSON.parse(raw);
      if (!data.version) return false;

      GameState.cash = data.gameState.cash;
      GameState.shopLevel = data.gameState.shopLevel;
      GameState.day = data.gameState.day;

      Inventory.deserialize(data.inventory);
      Collection.deserialize(data.collection);

      if (data.pricing) {
        PriceManager.deserialize(data.pricing);
      }

      return true;
    } catch {
      return false;
    }
  }

  static hasSave(): boolean {
    try {
      return localStorage.getItem(SAVE_KEY) !== null;
    } catch {
      return false;
    }
  }

  static deleteSave(): void {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {
      // Ignore
    }
  }

  static getSaveInfo(): { day: number; cash: number; savedAt: Date } | null {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const data: SaveData = JSON.parse(raw);
      return {
        day: data.gameState.day,
        cash: data.gameState.cash,
        savedAt: new Date(data.savedAt),
      };
    } catch {
      return null;
    }
  }
}
