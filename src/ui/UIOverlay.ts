export type PanelId = 'computer' | 'stock-shelf' | 'checkout' | 'day-summary' | 'storage';

const OVERLAY_STYLES = `
  .tcg-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    font-family: "Segoe UI", Arial, sans-serif;
    color: #fff;
    padding: 16px;
  }
  .tcg-panel {
    background: #1e1e3a;
    border: 2px solid #ffd700;
    border-radius: 12px;
    padding: 24px;
    max-width: 420px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  }
  .tcg-panel h2 {
    color: #ffd700;
    margin: 0 0 16px 0;
    font-size: 20px;
    text-align: center;
  }
  .tcg-panel h3 {
    color: #ffd700;
    margin: 16px 0 8px 0;
    font-size: 16px;
  }
  .tcg-btn {
    display: inline-block;
    padding: 10px 20px;
    margin: 4px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-family: inherit;
    cursor: pointer;
    color: #fff;
    transition: background 0.15s, transform 0.1s;
    touch-action: manipulation;
    min-height: 44px;
  }
  .tcg-btn:active { transform: scale(0.96); }
  .tcg-btn-primary { background: #c0392b; }
  .tcg-btn-primary:hover { background: #e74c3c; }
  .tcg-btn-secondary { background: #2c3e50; }
  .tcg-btn-secondary:hover { background: #34495e; }
  .tcg-btn-success { background: #27ae60; }
  .tcg-btn-success:hover { background: #2ecc71; }
  .tcg-btn-gold { background: #8b6914; }
  .tcg-btn-gold:hover { background: #a67c00; }
  .tcg-btn:disabled { opacity: 0.4; cursor: default; }
  .tcg-product-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px;
    margin: 4px 0;
    background: rgba(255,255,255,0.05);
    border-radius: 6px;
  }
  .tcg-product-info {
    flex: 1;
    min-width: 0;
  }
  .tcg-product-name {
    font-weight: bold;
    font-size: 14px;
  }
  .tcg-product-detail {
    font-size: 12px;
    color: #aaa;
  }
  .tcg-product-color {
    width: 12px;
    height: 18px;
    border-radius: 2px;
    margin-right: 10px;
    flex-shrink: 0;
  }
  .tcg-product-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }
  .tcg-center {
    text-align: center;
    margin-top: 16px;
  }
  .tcg-stat {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
    font-size: 14px;
  }
  .tcg-stat-label { color: #aaa; }
  .tcg-stat-value { color: #fff; font-weight: bold; }
  .tcg-divider {
    border: none;
    border-top: 1px solid rgba(255,255,255,0.1);
    margin: 12px 0;
  }
  .tcg-sale-item {
    text-align: center;
    padding: 12px;
    background: rgba(255,255,255,0.05);
    border-radius: 8px;
    margin: 8px 0;
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
  }
  .tcg-empty {
    text-align: center;
    padding: 24px;
    color: #888;
    font-style: italic;
  }
  .tcg-tab-bar {
    display: flex;
    gap: 4px;
    margin-bottom: 16px;
  }
  .tcg-tab {
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 6px 6px 0 0;
    font-size: 13px;
    font-family: inherit;
    cursor: pointer;
    color: #aaa;
    background: rgba(255,255,255,0.05);
    transition: background 0.15s;
    min-height: 40px;
  }
  .tcg-tab.active {
    color: #ffd700;
    background: rgba(255,215,0,0.15);
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
