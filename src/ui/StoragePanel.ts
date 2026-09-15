import { UIOverlay } from './UIOverlay';
import { Inventory } from '../data/Inventory';
import { BOOSTER_TO_SET } from '../data/Cards';

export class StoragePanel {
  private overlay: UIOverlay;
  private onOpenPacks: (() => void) | null = null;

  constructor(overlay: UIOverlay) {
    this.overlay = overlay;
  }

  setOnOpenPacks(handler: () => void): void {
    this.onOpenPacks = handler;
  }

  show(onClose: () => void): void {
    const items = Inventory.getStorageProducts();
    let rows = '';

    const hasBoosterPacks = items.some((item) => BOOSTER_TO_SET[item.product.id]);

    if (items.length === 0) {
      rows = '<div class="tcg-empty">Storage is empty. Order stock from the computer.</div>';
    } else {
      for (const item of items) {
        const colorHex = '#' + item.product.color.toString(16).padStart(6, '0');
        rows += `
          <div class="tcg-product-row">
            <div class="tcg-product-color" style="background:${colorHex}"></div>
            <div class="tcg-product-info">
              <div class="tcg-product-name">${item.product.name}</div>
              <div class="tcg-product-detail">Quantity: ${item.quantity}</div>
            </div>
          </div>
        `;
      }
    }

    const html = `
      <h2>Storage</h2>
      <p style="color:#aaa;font-size:13px;margin:0 0 12px 0">
        Your stock reserve. Use shelves to put products on display.
      </p>
      ${rows}
      <div class="tcg-center" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
        ${hasBoosterPacks ? '<button class="tcg-btn tcg-btn-gold" id="tcg-open-packs">Open Packs</button>' : ''}
        <button class="tcg-btn tcg-btn-secondary" id="tcg-close">Close</button>
      </div>
    `;

    this.overlay.show(html, onClose);

    this.overlay.onClick('#tcg-open-packs', () => {
      this.overlay.hide();
      if (this.onOpenPacks) this.onOpenPacks();
    });

    this.overlay.onClick('#tcg-close', () => {
      this.overlay.hide();
    });
  }
}
