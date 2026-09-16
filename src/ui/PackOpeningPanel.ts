import { UIOverlay } from './UIOverlay';
import { Inventory } from '../data/Inventory';
import { Collection } from '../data/Collection';
import { Card, BOOSTER_TO_SET, openBoosterPack, RARITY_COLORS, RARITY_LABELS, ELEMENT_COLORS } from '../data/Cards';
import { PRODUCTS } from '../data/Products';

export class PackOpeningPanel {
  private overlay: UIOverlay;

  constructor(overlay: UIOverlay) {
    this.overlay = overlay;
  }

  show(onClose: () => void): void {
    this.renderPackSelection(onClose);
  }

  private renderPackSelection(onClose: () => void): void {
    const boosters = PRODUCTS.filter((p) => BOOSTER_TO_SET[p.id]);
    let rows = '';

    for (const p of boosters) {
      const qty = Inventory.getStorageQuantity(p.id);
      const colorHex = '#' + p.color.toString(16).padStart(6, '0');
      rows += `
        <div class="tcg-product-row">
          <div class="tcg-product-color" style="background:${colorHex}"></div>
          <div class="tcg-product-info">
            <div class="tcg-product-name">${p.name}</div>
            <div class="tcg-product-detail">In storage: ${qty}</div>
          </div>
          <div class="tcg-product-actions">
            <button class="tcg-btn tcg-btn-gold" data-open="${p.id}" ${qty > 0 ? '' : 'disabled'}>
              Open
            </button>
          </div>
        </div>
      `;
    }

    if (!rows) {
      rows = '<div class="tcg-empty">No booster packs in storage.</div>';
    }

    const html = `
      <h2>Open Booster Packs</h2>
      <p style="color:#aaa;font-size:13px;margin:0 0 12px 0">
        Open a pack from your storage to add cards to your collection!
      </p>
      ${rows}
      <div class="tcg-center">
        <button class="tcg-btn tcg-btn-secondary" id="tcg-close">Close</button>
      </div>
    `;

    this.overlay.show(html, onClose);

    this.overlay.onClick('[data-open]', (e) => {
      const productId = (e.currentTarget as HTMLElement).dataset.open!;
      this.openPack(productId, onClose);
    });

    this.overlay.onClick('#tcg-close', () => {
      this.overlay.hide();
    });
  }

  private openPack(productId: string, onClose: () => void): void {
    const setName = BOOSTER_TO_SET[productId];
    if (!setName) return;
    if (!Inventory.removeFromStorage(productId, 1)) return;

    const cards = openBoosterPack(setName);
    for (const card of cards) {
      Collection.addCard(card);
    }

    this.renderReveal(cards, productId, onClose);
  }

  private renderReveal(cards: Card[], productId: string, onClose: () => void): void {
    const product = PRODUCTS.find((p) => p.id === productId);
    const packName = product ? product.name : 'Booster Pack';

    let cardHtml = '';
    for (const card of cards) {
      const rarityColor = '#' + RARITY_COLORS[card.rarity].toString(16).padStart(6, '0');
      const cardColor = '#' + ELEMENT_COLORS[card.element].primary.toString(16).padStart(6, '0');
      const owned = Collection.getCount(card.id);

      cardHtml += `
        <div style="
          background: linear-gradient(135deg, ${cardColor}22, ${rarityColor}22);
          border: 2px solid ${rarityColor};
          border-radius: 8px;
          padding: 10px;
          margin: 6px 0;
          text-align: center;
        ">
          <div style="font-size:11px;color:${rarityColor};text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">
            ${RARITY_LABELS[card.rarity]}
          </div>
          <div style="font-size:16px;font-weight:bold;color:#fff;margin-bottom:2px">
            ${card.name}
          </div>
          <div style="font-size:11px;color:#aaa">${card.description}</div>
          <div style="font-size:11px;color:#888;margin-top:4px">
            Value: £${card.value.toFixed(2)} · Owned: ${owned}
          </div>
        </div>
      `;
    }

    const remaining = Inventory.getStorageQuantity(productId);

    const html = `
      <h2>${packName}</h2>
      <p style="color:#ffd700;font-size:14px;text-align:center;margin:0 0 8px 0">
        You pulled 5 cards!
      </p>
      ${cardHtml}
      <div class="tcg-center" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
        <button class="tcg-btn tcg-btn-gold" id="tcg-open-another" ${remaining > 0 ? '' : 'disabled'}>
          Open Another (${remaining} left)
        </button>
        <button class="tcg-btn tcg-btn-secondary" id="tcg-back-packs">Back</button>
      </div>
    `;

    this.overlay.show(html, onClose);

    this.overlay.onClick('#tcg-open-another', () => {
      this.openPack(productId, onClose);
    });

    this.overlay.onClick('#tcg-back-packs', () => {
      this.renderPackSelection(onClose);
    });
  }
}
