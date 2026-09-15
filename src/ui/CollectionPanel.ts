import { UIOverlay } from './UIOverlay';
import { Collection } from '../data/Collection';
import { ALL_CARDS, RARITY_COLORS, RARITY_LABELS, Card } from '../data/Cards';

type FilterSet = 'all' | 'Dragon Realms' | 'Ocean Legends' | 'Forest Spirits';

export class CollectionPanel {
  private overlay: UIOverlay;
  private filterSet: FilterSet = 'all';

  constructor(overlay: UIOverlay) {
    this.overlay = overlay;
  }

  show(onClose: () => void): void {
    this.filterSet = 'all';
    this.render(onClose);
  }

  private render(onClose: () => void): void {
    const sets: FilterSet[] = ['all', 'Dragon Realms', 'Ocean Legends', 'Forest Spirits'];

    let tabsHtml = '<div class="tcg-tab-bar">';
    for (const s of sets) {
      const label = s === 'all' ? 'All' : s.split(' ')[0];
      tabsHtml += `<button class="tcg-tab ${this.filterSet === s ? 'active' : ''}" data-filter="${s}">${label}</button>`;
    }
    tabsHtml += '</div>';

    const filtered = this.filterSet === 'all'
      ? ALL_CARDS
      : ALL_CARDS.filter((c) => c.set === this.filterSet);

    const total = Collection.getTotalCards();
    const unique = Collection.getUniqueCount();
    const value = Collection.getCollectionValue(ALL_CARDS);

    let cardsHtml = '';
    for (const card of filtered) {
      const owned = Collection.getCount(card.id);
      cardsHtml += this.renderCard(card, owned);
    }

    const html = `
      <h2>Card Collection</h2>
      <div style="display:flex;justify-content:space-around;margin-bottom:12px;font-size:12px;color:#aaa">
        <span>Unique: <strong style="color:#ffd700">${unique}/${ALL_CARDS.length}</strong></span>
        <span>Total: <strong style="color:#fff">${total}</strong></span>
        <span>Value: <strong style="color:#2ecc71">£${value.toFixed(2)}</strong></span>
      </div>
      ${tabsHtml}
      <div style="max-height:50vh;overflow-y:auto">
        ${cardsHtml}
      </div>
      <div class="tcg-center">
        <button class="tcg-btn tcg-btn-secondary" id="tcg-close">Close</button>
      </div>
    `;

    this.overlay.show(html, onClose);

    this.overlay.onClick('[data-filter]', (e) => {
      this.filterSet = (e.currentTarget as HTMLElement).dataset.filter as FilterSet;
      this.render(onClose);
    });

    this.overlay.onClick('#tcg-close', () => {
      this.overlay.hide();
    });
  }

  private renderCard(card: Card, owned: number): string {
    const rarityColor = '#' + RARITY_COLORS[card.rarity].toString(16).padStart(6, '0');
    const opacity = owned > 0 ? '1' : '0.35';

    return `
      <div style="
        display:flex;
        align-items:center;
        padding:6px 8px;
        margin:3px 0;
        background:rgba(255,255,255,0.05);
        border-radius:6px;
        border-left:3px solid ${rarityColor};
        opacity:${opacity};
      ">
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:bold;color:#fff">${card.name}</div>
          <div style="font-size:11px;color:${rarityColor}">${RARITY_LABELS[card.rarity]} · ${card.set}</div>
        </div>
        <div style="text-align:right;flex-shrink:0;margin-left:8px">
          <div style="font-size:13px;color:#fff;font-weight:bold">×${owned}</div>
          <div style="font-size:10px;color:#888">£${card.value.toFixed(2)}</div>
        </div>
      </div>
    `;
  }
}
