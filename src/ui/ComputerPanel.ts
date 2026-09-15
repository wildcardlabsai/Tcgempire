import { UIOverlay } from './UIOverlay';
import { PRODUCTS, Product } from '../data/Products';
import { Inventory } from '../data/Inventory';
import { GameState } from '../data/GameState';

export class ComputerPanel {
  private overlay: UIOverlay;
  private currentTab: 'order' | 'inventory' = 'order';

  constructor(overlay: UIOverlay) {
    this.overlay = overlay;
  }

  show(onClose: () => void): void {
    this.currentTab = 'order';
    this.render(onClose);
  }

  private render(onClose: () => void): void {
    const html = `
      <h2>Shop Computer</h2>
      <div class="tcg-tab-bar">
        <button class="tcg-tab ${this.currentTab === 'order' ? 'active' : ''}" data-tab="order">Order Stock</button>
        <button class="tcg-tab ${this.currentTab === 'inventory' ? 'active' : ''}" data-tab="inventory">Inventory</button>
      </div>
      <div id="tcg-computer-body">
        ${this.currentTab === 'order' ? this.renderOrderTab() : this.renderInventoryTab()}
      </div>
      <div class="tcg-center">
        <button class="tcg-btn tcg-btn-secondary" id="tcg-close">Close</button>
      </div>
    `;

    this.overlay.show(html, onClose);

    this.overlay.onClick('[data-tab]', (e) => {
      const tab = (e.currentTarget as HTMLElement).dataset.tab as 'order' | 'inventory';
      this.currentTab = tab;
      this.render(onClose);
    });

    this.overlay.onClick('[data-order]', (e) => {
      const productId = (e.currentTarget as HTMLElement).dataset.order!;
      this.orderProduct(productId);
      this.render(onClose);
    });

    this.overlay.onClick('#tcg-close', () => {
      this.overlay.hide();
    });
  }

  private renderOrderTab(): string {
    const cash = GameState.cash;
    let rows = '';
    for (const p of PRODUCTS) {
      const canAfford = cash >= p.costPrice;
      const colorHex = '#' + p.color.toString(16).padStart(6, '0');
      rows += `
        <div class="tcg-product-row">
          <div class="tcg-product-color" style="background:${colorHex}"></div>
          <div class="tcg-product-info">
            <div class="tcg-product-name">${p.name}</div>
            <div class="tcg-product-detail">Cost: £${p.costPrice} · Sell: £${p.sellPrice}</div>
          </div>
          <div class="tcg-product-actions">
            <button class="tcg-btn tcg-btn-success" data-order="${p.id}" ${canAfford ? '' : 'disabled'}>
              Buy ×5
            </button>
          </div>
        </div>
      `;
    }
    return `
      <p style="color:#aaa;font-size:13px;margin:0 0 12px 0">
        Cash: <strong style="color:#2ecc71">£${cash.toLocaleString('en-GB')}</strong>
        — Order products to fill your storage.
      </p>
      ${rows}
    `;
  }

  private renderInventoryTab(): string {
    let rows = '';
    for (const p of PRODUCTS) {
      const storage = Inventory.getStorageQuantity(p.id);
      const shelf = Inventory.getShelfQuantity(p.id);
      if (storage === 0 && shelf === 0) continue;
      const colorHex = '#' + p.color.toString(16).padStart(6, '0');
      rows += `
        <div class="tcg-product-row">
          <div class="tcg-product-color" style="background:${colorHex}"></div>
          <div class="tcg-product-info">
            <div class="tcg-product-name">${p.name}</div>
            <div class="tcg-product-detail">Storage: ${storage} · Shelf: ${shelf}</div>
          </div>
        </div>
      `;
    }
    if (!rows) {
      return '<div class="tcg-empty">No stock. Order products from the Order tab.</div>';
    }
    return rows;
  }

  private orderProduct(productId: string): void {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    const qty = 5;
    const totalCost = product.costPrice * qty;
    if (GameState.cash < totalCost) return;

    GameState.cash -= totalCost;
    Inventory.addToStorage(productId, qty);
  }
}
