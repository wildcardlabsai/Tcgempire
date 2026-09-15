import { UIOverlay } from './UIOverlay';
import { Customer } from '../entities/Customer';
import { Inventory } from '../data/Inventory';
import { GameState } from '../data/GameState';
import { PriceManager } from '../data/PriceManager';

export class CheckoutPanel {
  private overlay: UIOverlay;

  constructor(overlay: UIOverlay) {
    this.overlay = overlay;
  }

  show(customer: Customer, onClose: () => void, onSale: (revenue: number) => void): void {
    const product = customer.desiredProduct;
    if (!product) {
      this.overlay.hide();
      return;
    }

    const colorHex = '#' + product.color.toString(16).padStart(6, '0');
    const canSell = Inventory.getShelfQuantity(product.id) >= customer.purchaseQty;
    const sellPrice = PriceManager.getSellPrice(product);
    const totalPrice = sellPrice * customer.purchaseQty;

    const html = `
      <h2>Customer at Counter</h2>
      <div class="tcg-sale-item">
        <div style="display:inline-block;width:24px;height:36px;background:${colorHex};border-radius:3px;margin-bottom:8px;border:1px solid rgba(0,0,0,0.2)"></div>
        <div class="tcg-sale-product">${product.name}</div>
        <div class="tcg-product-detail">×${customer.purchaseQty}</div>
        <div class="tcg-sale-price">£${totalPrice.toFixed(2)}</div>
        ${sellPrice !== product.sellPrice ? `<div style="font-size:11px;color:#888">Base: £${product.sellPrice} · Markup: ${PriceManager.getMarkup(product.id) > 0 ? '+' : ''}${PriceManager.getMarkup(product.id)}%</div>` : ''}
      </div>
      ${canSell ? '' : '<p style="color:#e74c3c;text-align:center;font-size:13px">Out of stock on shelves!</p>'}
      <div class="tcg-center">
        <button class="tcg-btn tcg-btn-success" id="tcg-sell" ${canSell ? '' : 'disabled'}>
          Sell
        </button>
        <button class="tcg-btn tcg-btn-secondary" id="tcg-close">
          Turn Away
        </button>
      </div>
    `;

    this.overlay.show(html, onClose);

    this.overlay.onClick('#tcg-sell', () => {
      if (!canSell) return;
      const revenue = totalPrice;
      Inventory.sellFromShelf(product.id, customer.purchaseQty);
      GameState.cash += revenue;
      customer.serve();
      onSale(revenue);
      this.overlay.hide();
    });

    this.overlay.onClick('#tcg-close', () => {
      customer.serve();
      this.overlay.hide();
    });
  }
}
