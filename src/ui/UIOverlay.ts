export type PanelId = 'computer' | 'stock-shelf' | 'checkout' | 'day-summary' | 'storage' | 'pack-opening' | 'collection';

const OVERLAY_STYLES = `
  .tcg-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    font-family: "Segoe UI", Arial, sans-serif;
    color: #fff;
    padding: 12px;
  }
  .tcg-panel {
    background: linear-gradient(145deg, #1e1e3a 0%, #16162e 100%);
    border: 2px solid #ffd700;
    border-radius: 16px;
    padding: 20px;
    max-width: 420px;
    width: 100%;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: 0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,215,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05);
    scrollbar-width: thin;
    scrollbar-color: rgba(212,168,84,0.3) transparent;
  }
  .tcg-panel::-webkit-scrollbar { width: 6px; }
  .tcg-panel::-webkit-scrollbar-track { background: transparent; }
  .tcg-panel::-webkit-scrollbar-thumb { background: rgba(212,168,84,0.3); border-radius: 3px; }
  .tcg-panel h2 {
    color: #ffd700;
    margin: 0 0 14px 0;
    font-size: 20px;
    text-align: center;
    text-shadow: 0 1px 8px rgba(255,215,0,0.2);
    letter-spacing: 0.5px;
  }
  .tcg-panel h3 {
    color: #ffd700;
    margin: 14px 0 8px 0;
    font-size: 15px;
  }
  .tcg-btn {
    display: inline-block;
    padding: 10px 20px;
    margin: 4px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    cursor: pointer;
    color: #fff;
    transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
    touch-action: manipulation;
    min-height: 44px;
    font-weight: 600;
    letter-spacing: 0.3px;
  }
  .tcg-btn:active { transform: scale(0.96); }
  .tcg-btn-primary { background: linear-gradient(135deg, #c0392b, #a93226); box-shadow: 0 2px 8px rgba(192,57,43,0.3); }
  .tcg-btn-primary:hover { background: linear-gradient(135deg, #e74c3c, #c0392b); }
  .tcg-btn-secondary { background: linear-gradient(135deg, #34495e, #2c3e50); box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
  .tcg-btn-secondary:hover { background: linear-gradient(135deg, #3d566e, #34495e); }
  .tcg-btn-success { background: linear-gradient(135deg, #27ae60, #1e8449); box-shadow: 0 2px 8px rgba(39,174,96,0.3); }
  .tcg-btn-success:hover { background: linear-gradient(135deg, #2ecc71, #27ae60); }
  .tcg-btn-gold { background: linear-gradient(135deg, #a67c00, #8b6914); box-shadow: 0 2px 8px rgba(139,105,20,0.3); }
  .tcg-btn-gold:hover { background: linear-gradient(135deg, #c49000, #a67c00); }
  .tcg-btn:disabled { opacity: 0.35; cursor: default; box-shadow: none; }
  .tcg-product-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    margin: 4px 0;
    background: rgba(255,255,255,0.04);
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.06);
    transition: background 0.15s;
  }
  .tcg-product-row:hover { background: rgba(255,255,255,0.07); }
  .tcg-product-info {
    flex: 1;
    min-width: 0;
  }
  .tcg-product-name {
    font-weight: 600;
    font-size: 14px;
  }
  .tcg-product-detail {
    font-size: 12px;
    color: #999;
    margin-top: 2px;
  }
  .tcg-product-color {
    width: 14px;
    height: 20px;
    border-radius: 3px;
    margin-right: 12px;
    flex-shrink: 0;
    box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  }
  .tcg-product-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }
  .tcg-center {
    text-align: center;
    margin-top: 16px;
  }
  .tcg-stat {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    font-size: 14px;
  }
  .tcg-stat-label { color: #999; }
  .tcg-stat-value { color: #fff; font-weight: 600; }
  .tcg-divider {
    border: none;
    border-top: 1px solid rgba(255,255,255,0.08);
    margin: 12px 0;
  }
  .tcg-sale-item {
    text-align: center;
    padding: 14px;
    background: rgba(255,255,255,0.04);
    border-radius: 12px;
    margin: 8px 0;
    border: 1px solid rgba(255,215,0,0.15);
  }
  .tcg-sale-product {
    font-size: 18px;
    font-weight: bold;
    color: #ffd700;
  }
  .tcg-sale-price {
    font-size: 24px;
    color: #2ecc71;
    margin: 8px 0;
    font-weight: 700;
  }
  .tcg-empty {
    text-align: center;
    padding: 28px;
    color: #777;
    font-style: italic;
  }
  .tcg-tab-bar {
    display: flex;
    gap: 4px;
    margin-bottom: 14px;
    background: rgba(0,0,0,0.2);
    border-radius: 10px;
    padding: 3px;
  }
  .tcg-tab {
    flex: 1;
    padding: 8px 4px;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-family: inherit;
    cursor: pointer;
    color: #888;
    background: transparent;
    transition: background 0.2s, color 0.2s;
    min-height: 38px;
    font-weight: 500;
  }
  .tcg-tab:hover { color: #ccc; }
  .tcg-tab.active {
    color: #ffd700;
    background: rgba(255,215,0,0.12);
    font-weight: 600;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }
`;

let styleInjected = false;

function injectStyles(): void {
  if (styleInjected) return;
  const style = document.createElement('style');
  style.textContent = OVERLAY_STYLES;
  document.head.appendChild(style);
  styleInjected = true;
}

export class UIOverlay {
  private container: HTMLDivElement | null = null;
  private onCloseCallback: (() => void) | null = null;

  constructor() {
    injectStyles();
  }

  show(html: string, onClose?: () => void): void {
    this.hide();
    this.onCloseCallback = onClose ?? null;

    this.container = document.createElement('div');
    this.container.className = 'tcg-overlay';
    this.container.innerHTML = `<div class="tcg-panel">${html}</div>`;
    document.body.appendChild(this.container);

    this.container.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).classList.contains('tcg-overlay')) {
        this.hide();
      }
    });
  }

  hide(): void {
    if (this.container) {
      this.container.remove();
      this.container = null;
      if (this.onCloseCallback) {
        this.onCloseCallback();
        this.onCloseCallback = null;
      }
    }
  }

  isVisible(): boolean {
    return this.container !== null;
  }

  getElement(): HTMLDivElement | null {
    return this.container;
  }

  onClick(selector: string, handler: (e: Event) => void): void {
    if (!this.container) return;
    this.container.querySelectorAll(selector).forEach((el) => {
      el.addEventListener('click', handler);
    });
  }

  updateContent(selector: string, html: string): void {
    if (!this.container) return;
    const el = this.container.querySelector(selector);
    if (el) el.innerHTML = html;
  }
}
