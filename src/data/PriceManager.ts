import { PRODUCTS, Product } from './Products';

class PriceManagerClass {
  private markups: Map<string, number> = new Map();

  getMarkup(productId: string): number {
    return this.markups.get(productId) ?? 0;
  }

  setMarkup(productId: string, percent: number): void {
    this.markups.set(productId, Math.max(-50, Math.min(100, percent)));
  }

  getSellPrice(product: Product): number {
    const markup = this.getMarkup(product.id);
    const price = product.sellPrice * (1 + markup / 100);
    return Math.round(price * 100) / 100;
  }

  reset(): void {
    this.markups.clear();
  }

  serialize(): Record<string, number> {
    const data: Record<string, number> = {};
    for (const [id, markup] of this.markups.entries()) {
      data[id] = markup;
    }
    return data;
  }

  deserialize(data: Record<string, number>): void {
    this.markups.clear();
    for (const [id, markup] of Object.entries(data)) {
      this.markups.set(id, markup);
    }
  }
}

export const PriceManager = new PriceManagerClass();
