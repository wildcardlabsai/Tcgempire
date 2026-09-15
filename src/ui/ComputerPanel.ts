import { UIOverlay } from './UIOverlay';
import { PRODUCTS } from '../data/Products';
import { Inventory } from '../data/Inventory';
import { GameState } from '../data/GameState';
import { Collection } from '../data/Collection';
import { ALL_CARDS, RARITY_COLORS, RARITY_LABELS } from '../data/Cards';
import { SaveManager } from '../data/SaveManager';
import { PriceManager } from '../data/PriceManager';
import { getShopLevel, getNextUpgrade, SHOP_LEVELS } from '../data/ShopUpgrades';
import { Decorations, DECORATION_CATALOG } from '../data/Decorations';

type TabId = 'order' | 'pricing' | 'upgrade' | 'decor' | 'inventory' | 'collection' | 'save';

export class ComputerPanel {
  private overlay: UIOverlay;
  private currentTab: TabId = 'order';
  private onDecorationChange: (() => void) | null = null;
  private onOrderCallback: ((productName: string, qty: number) => void) | null = null;

  constructor(overlay: UIOverlay) {
    this.overlay = overlay;
  }

  setOnDecorationChange(cb: () => void): void {
    this.onDecorationChange = cb;
  }

  setOnOrder(cb: (productName: string, qty: number) => void): void {
    this.onOrderCallback = cb;
  }

  show(onClose: () => void): void {
    this.currentTab = 'order';
    this.render(onClose);
  }

  private render(onClose: () => void): void {
    const tabs: { id: TabId; label: string }[] = [
      { id: 'order', label: 'Order' },
      { id: 'pricing', label: 'Pricing' },
      { id: 'upgrade', label: 'Upgrade' },
      { id: 'decor', label: 'Decor' },
      { id: 'collection', label: 'Cards' },
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
      case 'pricing': body = this.renderPricingTab(); break;
      case 'upgrade': body = this.renderUpgradeTab(); break;
      case 'decor': body = this.renderDecorTab(); break;
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
      const tab = (e.currentTarget as HTMLElement).dataset.tab as TabId;
      this.currentTab = tab;
      this.render(onClose);
    });

    this.overlay.onClick('[data-order]', (e) => {
      const productId = (e.currentTarget as HTMLElement).dataset.order!;
      this.orderProduct(productId);
      this.render(onClose);
    });

    this.overlay.onClick('[data-markup]', (e) => {
      const el = e.currentTarget as HTMLElement;
      const productId = el.dataset.markup!;
      const delta = parseInt(el.dataset.delta!);
      const current = PriceManager.getMarkup(productId);
      PriceManager.setMarkup(productId, current + delta);
      this.render(onClose);
    });

    this.overlay.onClick('[data-buy-decor]', (e) => {
      const decorId = (e.currentTarget as HTMLElement).dataset.buyDecor!;
      const def = DECORATION_CATALOG.find(d => d.id === decorId);
      if (def && GameState.spendCash(def.cost)) {
        Decorations.place(decorId);
        if (this.onDecorationChange) this.onDecorationChange();
      }
      this.render(onClose);
    });

    this.overlay.onClick('#tcg-upgrade-shop', () => {
      const next = getNextUpgrade(GameState.shopLevel);
      if (next && GameState.spendCash(next.upgradeCost)) {
        GameState.shopLevel = next.level;
      }
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
      const totalCost = p.costPrice * 5;
      const canAfford = cash >= totalCost;
      const colorHex = '#' + p.color.toString(16).padStart(6, '0');
      rows += `
        <div class="tcg-product-row">
          <div class="tcg-product-color" style="background:${colorHex}"></div>
          <div class="tcg-product-info">
            <div class="tcg-product-name">${p.name}</div>
            <div class="tcg-product-detail">Cost: £${totalCost} (£${p.costPrice} ea)</div>
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

  private renderPricingTab(): string {
    let rows = '';
    for (const p of PRODUCTS) {
      const markup = PriceManager.getMarkup(p.id);
      const sellPrice = PriceManager.getSellPrice(p);
      const profit = sellPrice - p.costPrice;
      const profitColor = profit > 0 ? '#2ecc71' : profit < 0 ? '#e74c3c' : '#aaa';
      const colorHex = '#' + p.color.toString(16).padStart(6, '0');
      const markupColor = markup > 0 ? '#2ecc71' : markup < 0 ? '#e74c3c' : '#fff';

      rows += `
        <div class="tcg-product-row" style="flex-wrap:wrap">
          <div class="tcg-product-color" style="background:${colorHex}"></div>
          <div class="tcg-product-info">
            <div class="tcg-product-name">${p.name}</div>
            <div class="tcg-product-detail">
              Base: £${p.sellPrice} · Price: <strong style="color:${markupColor}">£${sellPrice.toFixed(2)}</strong> · Profit: <span style="color:${profitColor}">£${profit.toFixed(2)}</span>
            </div>
          </div>
          <div class="tcg-product-actions">
            <button class="tcg-btn tcg-btn-secondary" data-markup="${p.id}" data-delta="-10" style="padding:6px 10px;min-height:36px">-10%</button>
            <span style="min-width:40px;text-align:center;font-size:13px;color:${markupColor}">${markup > 0 ? '+' : ''}${markup}%</span>
            <button class="tcg-btn tcg-btn-secondary" data-markup="${p.id}" data-delta="10" style="padding:6px 10px;min-height:36px">+10%</button>
          </div>
        </div>
      `;
    }
    return `
      <p style="color:#aaa;font-size:13px;margin:0 0 12px 0">
        Set markups on your products. Higher prices mean more profit but customers may not buy!
      </p>
      ${rows}
    `;
  }

  private renderUpgradeTab(): string {
    const current = getShopLevel(GameState.shopLevel);
    const next = getNextUpgrade(GameState.shopLevel);
    const cash = GameState.cash;

    let progressHtml = '<div style="display:flex;gap:4px;margin-bottom:16px">';
    for (let i = 0; i < SHOP_LEVELS.length; i++) {
      const filled = i < GameState.shopLevel;
      progressHtml += `<div style="flex:1;height:6px;border-radius:3px;background:${filled ? '#ffd700' : 'rgba(255,255,255,0.1)'}"></div>`;
    }
    progressHtml += '</div>';

    let currentHtml = `
      <div style="background:rgba(255,215,0,0.1);border:1px solid rgba(255,215,0,0.3);border-radius:8px;padding:12px;margin-bottom:12px">
        <div style="font-size:15px;font-weight:bold;color:#ffd700">${current.name}</div>
        <div style="font-size:12px;color:#aaa">Level ${current.level} · ${current.description}</div>
        <div style="margin-top:6px;font-size:12px;color:#ccc">
          Max Customers: ${current.maxCustomers} · Patience: ${current.customerPatience}s
        </div>
      </div>
    `;

    let upgradeHtml = '';
    if (next) {
      const canAfford = cash >= next.upgradeCost;
      upgradeHtml = `
        <div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:12px;margin-bottom:8px">
          <div style="font-size:14px;font-weight:bold;color:#fff">${next.name}</div>
          <div style="font-size:12px;color:#aaa">${next.description}</div>
          <div style="margin-top:6px;font-size:12px;color:#ccc">
            Customers: <strong style="color:#2ecc71">${next.maxCustomers}</strong> ·
            Patience: <strong style="color:#2ecc71">${next.customerPatience}s</strong>
          </div>
          <div style="margin-top:6px;font-size:14px;color:#ffd700;font-weight:bold">Cost: £${next.upgradeCost.toLocaleString('en-GB')}</div>
        </div>
        <button class="tcg-btn tcg-btn-success" id="tcg-upgrade-shop" ${canAfford ? '' : 'disabled'} style="width:100%">
          ${canAfford ? 'Upgrade Shop' : `Need £${(next.upgradeCost - cash).toLocaleString('en-GB')} more`}
        </button>
      `;
    } else {
      upgradeHtml = '<div style="text-align:center;padding:12px;color:#ffd700;font-style:italic">Maximum level reached!</div>';
    }

    return `${progressHtml}${currentHtml}${upgradeHtml}`;
  }

  private renderDecorTab(): string {
    const cash = GameState.cash;
    const rating = Decorations.getRating();
    const bonus = Decorations.getAttractionBonus();
    const bonusPct = Math.round(bonus * 100);
    const placed = Decorations.getPlacedCount();

    const starsHtml = this.renderStars(rating);

    let rows = '';
    for (const d of DECORATION_CATALOG) {
      const owned = Decorations.hasDecoration(d.id);
      const locked = GameState.shopLevel < d.minLevel;
      const canAfford = cash >= d.cost;
      const colorHex = '#' + d.color.toString(16).padStart(6, '0');
      const bonusTxt = '+' + Math.round(d.attractionBonus * 100) + '%';

      let actionHtml: string;
      if (owned) {
        actionHtml = '<span style="color:#2ecc71;font-size:12px;font-weight:bold">Placed</span>';
      } else if (locked) {
        actionHtml = `<span style="color:#888;font-size:11px">Lv.${d.minLevel}</span>`;
      } else {
        actionHtml = `<button class="tcg-btn tcg-btn-success" data-buy-decor="${d.id}" ${canAfford ? '' : 'disabled'} style="padding:6px 12px;min-height:36px">£${d.cost}</button>`;
      }

      rows += `
        <div class="tcg-product-row" style="opacity:${locked ? '0.4' : '1'}">
          <div style="width:28px;height:28px;background:${colorHex};border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:16px;margin-right:10px;flex-shrink:0">${d.icon}</div>
          <div class="tcg-product-info">
            <div class="tcg-product-name">${d.name}</div>
            <div class="tcg-product-detail">${d.description} · <span style="color:#ffd700">${bonusTxt} attraction</span></div>
          </div>
          <div class="tcg-product-actions">${actionHtml}</div>
        </div>
      `;
    }

    return `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div style="font-size:13px;color:#aaa">
          Shop Rating: ${starsHtml} <span style="color:#ffd700;font-weight:bold">${rating.toFixed(1)}</span>
        </div>
        <div style="font-size:12px;color:#aaa">
          Attraction: <strong style="color:#2ecc71">+${bonusPct}%</strong> · Placed: ${placed}/10
        </div>
      </div>
      <div style="max-height:50vh;overflow-y:auto">${rows}</div>
    `;
  }

  private renderStars(rating: number): string {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        html += '<span style="color:#ffd700">★</span>';
      } else if (rating >= i - 0.5) {
        html += '<span style="color:#ffd700">★</span>';
      } else {
        html += '<span style="color:rgba(255,255,255,0.2)">★</span>';
      }
    }
    return html;
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
    if (this.onOrderCallback) {
      this.onOrderCallback(product.name, qty);
    }
  }
}
