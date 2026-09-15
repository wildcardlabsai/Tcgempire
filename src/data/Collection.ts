import { Card } from './Cards';

class CollectionManager {
  private cards: Map<string, number> = new Map();

  addCard(card: Card): void {
    const count = this.cards.get(card.id) ?? 0;
    this.cards.set(card.id, count + 1);
  }

  getCount(cardId: string): number {
    return this.cards.get(cardId) ?? 0;
  }

  getTotalCards(): number {
    let total = 0;
    for (const count of this.cards.values()) {
      total += count;
    }
    return total;
  }

  getUniqueCount(): number {
    return this.cards.size;
  }

  getCollectionValue(allCards: Card[]): number {
    let value = 0;
    for (const card of allCards) {
      const count = this.cards.get(card.id) ?? 0;
      value += card.value * count;
    }
    return Math.round(value * 100) / 100;
  }

  getAllOwned(): { cardId: string; count: number }[] {
    const result: { cardId: string; count: number }[] = [];
    for (const [cardId, count] of this.cards.entries()) {
      result.push({ cardId, count });
    }
    return result;
  }

  reset(): void {
    this.cards.clear();
  }

  serialize(): Record<string, number> {
    const data: Record<string, number> = {};
    for (const [id, count] of this.cards.entries()) {
      data[id] = count;
    }
    return data;
  }

  deserialize(data: Record<string, number>): void {
    this.cards.clear();
    for (const [id, count] of Object.entries(data)) {
      this.cards.set(id, count);
    }
  }
}

export const Collection = new CollectionManager();
