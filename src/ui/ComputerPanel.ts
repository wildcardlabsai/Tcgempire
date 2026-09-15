import { UIOverlay } from './UIOverlay';
import { PRODUCTS, Product } from '../data/Products';
import { Inventory } from '../data/Inventory';
import { GameState } from '../data/GameState';
import { Collection } from '../data/Collection';
import { ALL_CARDS, RARITY_COLORS, RARITY_LABELS } from '../data/Cards';
import { SaveManager } from '../data/SaveManager';

export class ComputerPanel {
  private overlay: UIOverlay;
  private currentTab: 'order' | 'inventory' | 'collection' | 'save' = 'order';

  constructor(overlay: UIOverlay) {
    this.overlay = overlay;
  }

  show(onClose: () => void): void {
    this.currentTab = 'order';
    this.render(onClose);
  }

  private render(onClose: () => void): void {
    const tabs: { id: 'order' | 'inventory' | 'collection' | 'save'; label: string }[] = [
      { id: 'order', label: 'Order' },
      { id: 'inventory', label: 'Inventory' },
      { id: 'collection', label: 'Collection' },
      { id: 'save', label: 'Save' },
    ];

    let tabsHtml = '<div class="tcg-tab-bar">';
    for (const tab of tabs) {
      tabsHtml += `<button class="tcg-tab ${this.currentTab === tab.id ? 'active' : ''}" data-tab="${tab.id}">${tab.label}</button>`;
    }
    tabsHtml += '</div>';

    let body = '';
    switch (this.currentTab) {
      case 'order': body = this.renderOrderTab(); break;
      case 'inventory': body = this.renderInventoryTab(); break;
      case 'collection': body = this.renderCollectionTab(); break;
      case 'save': body = this.renderSaveTab(); break;
    }

    const html = `
      <h2>Shop Computer</h2>
      ${tabsHtml}
      <div id="tcg-computer-body">${body}</div>
      <div class="tcg-center">
        <button class="tcg-btn tcg-btn-secondary" id="tcg-close">Close</button>
      </div>
    `;

    this.overlay.show(html, onClose);

    this.overlay.onClick('[data-tab]', (e) => {
      const tab = (e.currentTarget as HTMLElement).dataset.tab as typeof this.currentTab;
      this.currentTab = tab;
      this.render(onClose);
    });

    this.overlay.onClick('[data-order]', (e) => {
      const productId = (e.currentTarget as HTMLElement).dataset.order!;
      this.orderProduct(productId);
      this.render(onClose);
    });

    this.overlay.onClick('#tcg-save-game', () => {
      SaveManager.save();
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

  private renderCollectionTab(): string {
    const unique = Collection.getUniqueCount();
    const total = Collection.getTotalCards();
    const value = Collection.getCollectionValue(ALL_CARDS);

    let cardsHtml = '';
    for (const card of ALL_CARDS) {
      const owned = Collection.getCount(card.id);
      const rarityColor = '#' + RARITY_COLORS[card.rarity].toString(16).padStart(6, '0');
      const opacity = owned > 0 ? '1' : '0.3';

      cardsHtml += `
        <div style="display:flex;align-items:center;padding:4px 6px;margin:2px 0;background:rgba(255,255,255,0.05);border-radius:4px;border-left:3px solid ${rarityColor};opacity:${opacity}">
          <div style="flex:1;min-width:0">
            <span style="font-size:12px;font-weight:bold;color:#fff">${card.name}</span>
            <span style="font-size:10px;color:${rarityColor};margin-left:6px">${RARITY_LABELS[card.rarity]}</span>
          </div>
          <span style="font-size:12px;color:#fff;flex-shrink:0">×${owned}</span>
        </div>
      `;
    }

    return `
      <div style="display:flex;justify-content:space-around;margin-bottom:12px;font-size:12px;color:#aaa">
        <span>Unique: <strong style="color:#ffd700">${unique}/${ALL_CARDS.length}</strong></span>
        <span>Total: <strong style="color:#fff">${total}</strong></span>
        <span>Value: <strong style="color:#2ecc71">£${value.toFixed(2)}</strong></span>
      </div>
      <div style="max-height:45vh;overflow-y:auto">${cardsHtml}</div>
    `;
  }

  private renderSaveTab(): string {
    const saveInfo = SaveManager.getSaveInfo();
    let status = '';
    if (saveInfo) {
      const date = saveInfo.savedAt;
      const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      status = `
        <div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:12px;margin-bottom:16px">
          <div class="tcg-stat"><span class="tcg-stat-label">Last saved</span><span class="tcg-stat-value">${dateStr} ${timeStr}</span></div>
          <div class="tcg-stat"><span class="tcg-stat-label">Day</span><span class="tcg-stat-value">${saveInfo.day}</span></div>
          <div class="tcg-stat"><span class="tcg-stat-label">Cash</span><span class="tcg-stat-value">£${saveInfo.cash.toLocaleString('en-GB')}</span></div>
        </div>
      `;
    } else {
      status = '<p style="color:#888;font-style:italic;text-align:center;margin-bottom:16px">No save data found.</p>';
    }

    return `
      ${status}
      <div class="tcg-center">
        <button class="tcg-btn tcg-btn-success" id="tcg-save-game" style="width:100%">Save Game</button>
      </div>
    `;
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
