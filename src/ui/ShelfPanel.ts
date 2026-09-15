import { UIOverlay } from './UIOverlay';
import { Inventory } from '../data/Inventory';

export class ShelfPanel {
  private overlay: UIOverlay;
  private onStocked: (() => void) | null = null;

  constructor(overlay: UIOverlay) {
    this.overlay = overlay;
  }

  show(onClose: () => void, onStocked?: () => void): void {
    this.onStocked = onStocked ?? null;
    this.render(onClose);
  }

  private render(onClose: () => void): void {
    const storageItems = Inventory.getStorageProducts();
    let rows = '';

    if (storageItems.length === 0) {
      rows = '<div class="tcg-empty">Storage is empty. Order stock from the computer.</div>';
    } else {
      for (const item of storageItems) {
        const colorHex = '#' + item.product.color.toString(16).padStart(6, '0');
        const onShelf = Inventory.getShelfQuantity(item.product.id);
        rows += `
          <div class="tcg-product-row">
            <div class="tcg-product-color" style="background:${colorHex}"></div>
            <div class="tcg-product-info">
              <div class="tcg-product-name">${item.product.name}</div>
              <div class="tcg-product-detail">Storage: ${item.quantity} · On shelf: ${onShelf}</div>
            </div>
            <div class="tcg-product-actions">
              <button class="tcg-btn tcg-btn-gold" data-stock="${item.product.id}">
                Stock ×5
              </button>
            </div>
          </div>
        `;
      }
    }

    const html = `
      <h2>Stock Shelves</h2>
      <p style="color:#aaa;font-size:13px;margin:0 0 12px 0">
        Move products from storage onto the shop shelves.
      </p>
      ${rows}
      <div class="tcg-center">
        <button class="tcg-btn tcg-btn-secondary" id="tcg-close">Close</button>
      </div>
    `;

    this.overlay.show(html, onClose);

    this.overlay.onClick('[data-stock]', (e) => {
      const productId = (e.currentTarget as HTMLElement).dataset.stock!;
      Inventory.moveToShelf(productId, 5);
      if (this.onStocked) this.onStocked();
      this.render(onClose);
    });

    this.overlay.onClick('#tcg-close', () => {
      this.overlay.hide();
    });
  }
}
