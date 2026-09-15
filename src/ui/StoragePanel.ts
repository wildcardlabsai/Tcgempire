import { UIOverlay } from './UIOverlay';
import { Inventory } from '../data/Inventory';

export class StoragePanel {
  private overlay: UIOverlay;

  constructor(overlay: UIOverlay) {
    this.overlay = overlay;
  }

  show(onClose: () => void): void {
    const items = Inventory.getStorageProducts();
    let rows = '';

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
      <div class="tcg-center">
        <button class="tcg-btn tcg-btn-secondary" id="tcg-close">Close</button>
      </div>
    `;

    this.overlay.show(html, onClose);

    this.overlay.onClick('#tcg-close', () => {
      this.overlay.hide();
    });
  }
}
